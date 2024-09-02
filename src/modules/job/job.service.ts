import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { PaginationDto, PaginationResultDto } from '../../base/pagination';
import { ErrorHelper } from '../../utils';
import { Profile } from '../base/entities/profile.entity';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>
  ) {}

  async findUnpaidJobsForUser(profileId: number, query: PaginationDto) {
    const [jobs, total] = await this.jobRepository
      .createQueryBuilder('job')
      .innerJoin('job.contract', 'contract')
      .innerJoin('contract.client', 'client')
      .innerJoin('contract.contractor', 'contractor')
      .where('job.isPaid = :isPaid', { isPaid: false })
      .andWhere(
        'contract.status = :status AND (contract.clientId = :profileId OR contract.contractorId = :profileId)',
        { status: 'in_progress', profileId }
      )
      .skip(query.skip)
      .take(query.limit)
      .orderBy('job.createdAt', query.order)
      .getManyAndCount();

    return new PaginationResultDto(jobs, {
      itemCount: total,
      pageOptionsDto: query,
    });
  }

  async payForJob(jobId: number, amount: number, clientId: number): Promise<void> {
    return this.jobRepository.manager.transaction(async manager => {
      const job = await manager.findOne(Job, {
        where: { id: jobId },
        relations: {
          contract: {
            client: true,
            contractor: true,
          },
        },
        lock: { mode: 'pessimistic_write' },
      });

      if (job.isPaid) {
        ErrorHelper.BadRequestException('Job is already paid');
      }

      const client = await manager.findOne(Profile, {
        where: { id: clientId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!client) {
        ErrorHelper.NotFoundException('Client not found');
      }

      if (client.balance < amount) {
        ErrorHelper.BadRequestException('Insufficient balance');
      }

      const contractor = await manager.findOne(Profile, {
        where: { id: job.contract.contractor.id },
        lock: { mode: 'pessimistic_write' },
      });

      if (job.contract.client.balance < amount) {
        ErrorHelper.BadRequestException('Insufficient balance');
      }

      client.balance -= amount;
      contractor.balance += amount;

      job.isPaid = true;
      job.paidDate = new Date();

      await manager.save(Profile, client);
      await manager.save(Profile, contractor);
      await manager.save(Job, job);
    });
  }
}
