import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Contract } from './entities/contract.entity';
import { PaginationDto, PaginationResultDto } from '../../base/pagination';
import { ErrorHelper } from '../../utils';
import { ContractStatus } from '../../enums';

@Injectable()
export class ContractService {
  constructor(@InjectRepository(Contract) private contractRepository: Repository<Contract>) {}

  async findContractById(contractId: number, profileId: number): Promise<Contract | null> {
    const contract = await this.contractRepository.findOne({
      where: [
        { id: contractId, contractor: { id: profileId } },
        { id: contractId, client: { id: profileId } },
      ],
    });

    if (!contract) {
      ErrorHelper.NotFoundException('Contract not found');
    }

    return contract;
  }

  async findProfileContracts(profileId: number, query: PaginationDto) {
    const [contracts, total] = await this.contractRepository.findAndCount({
      where: [
        { contractor: { id: profileId }, status: Not(ContractStatus.TERMINATED) },
        { client: { id: profileId }, status: Not(ContractStatus.TERMINATED) },
      ],
      take: query.limit,
      skip: query.skip,
      order: { createdAt: query.order },
    });

    return new PaginationResultDto(contracts, {
      itemCount: total,
      pageOptionsDto: query,
    });
  }
}
