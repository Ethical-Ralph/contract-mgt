import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { Job } from '../job/entities/job.entity';
import { ErrorHelper } from '../../utils';
import { ContractStatus } from '../../enums';
import { Contract } from '../contract/entities/contract.entity';

@Injectable()
export class BaseService {
  constructor(@InjectRepository(Job) private readonly jobRepository: Repository<Job>) {}

  async deposit(
    userId: number,
    amount: number,
    profileId: number
  ): Promise<{
    newBalance: number;
  }> {
    if (userId !== profileId) {
      ErrorHelper.UnauthorizedException('You are not authorized to fund this account');
    }

    return this.jobRepository.manager.transaction(async manager => {
      const result = await manager
        .createQueryBuilder(Contract, 'contract')
        .leftJoin('contract.client', 'client')
        .leftJoin('contract.jobs', 'job')
        .select('client.id', 'clientId')
        .addSelect(
          'SUM(CASE WHEN job.isPaid = false THEN job.price ELSE 0 END)',
          'totalOutstandingPayments'
        )
        .where('client.id = :userId', { userId })
        .andWhere('contract.status <> :terminatedStatus', {
          terminatedStatus: ContractStatus.TERMINATED,
        })
        .groupBy('client.id')
        .getRawOne();

      if (!result) {
        ErrorHelper.NotFoundException('Account not found');
      }

      const totalOutstandingPayments = parseFloat(result.totalOutstandingPayments) || 0;
      const allowedDepositLimit = totalOutstandingPayments * 0.25;

      if (amount > allowedDepositLimit) {
        ErrorHelper.BadRequestException('Deposit amount exceeds 25% of total outstanding payments');
      }

      const profile = await manager.findOne(Profile, {
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      });

      const newBalance = Number(profile.balance) + Number(amount);

      await manager.save(Profile, {
        id: userId,
        balance: newBalance,
      });

      return {
        newBalance,
      };
    });
  }
}
