import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { Contract } from './entities/contract.entity';
import { Profile } from '../base/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contract, Profile])],
  controllers: [ContractController],
  providers: [ContractService],
})
export class ContractModule {}
