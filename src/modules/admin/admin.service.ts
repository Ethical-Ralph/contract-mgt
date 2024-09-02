import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from '../job/entities/job.entity';
import { DateRangeDto, DateRangePlusLimitDto } from './dto/admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>
  ) {}

  async getBestProfession(query: DateRangeDto): Promise<any> {
    const { start, end } = query;

    return this.jobRepository
      .createQueryBuilder('job')
      .innerJoin('job.contract', 'contract')
      .innerJoin('contract.contractor', 'contractor')
      .select('contractor.profession', 'profession')
      .addSelect('SUM(job.price)', 'totalearnings')
      .where('job.createdAt BETWEEN :start AND :end', { start, end })
      .andWhere('contract.status = :status', { status: 'in_progress' })
      .groupBy('contractor.profession')
      .orderBy('totalearnings', 'DESC')
      .limit(1)
      .getRawOne();
  }

  async getBestClients(query: DateRangePlusLimitDto): Promise<any> {
    const { start, end, limit } = query;

    return this.jobRepository
      .createQueryBuilder('job')
      .innerJoin('job.contract', 'contract')
      .innerJoin('contract.client', 'client')
      .select('client.id', 'clientId')
      .addSelect('client.firstName', 'firstName')
      .addSelect('client.lastName', 'lastName')
      .addSelect('SUM(job.price)', 'totalpaid')
      .where('job.paidDate BETWEEN :start AND :end', { start, end })
      .andWhere('contract.status = :status', { status: 'in_progress' })
      .groupBy('client.id, client.firstName, client.lastName')
      .orderBy('totalpaid', 'DESC')
      .limit(limit)
      .getRawMany();
  }
}
