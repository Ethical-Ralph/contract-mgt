import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContractService } from './contract.service';
import { Contract } from './entities/contract.entity';
import { ContractStatus } from '../../enums';
import { PaginationDto, PaginationResultDto } from '../../base/pagination';

describe('ContractService', () => {
  let service: ContractService;
  let contractRepository: Repository<Contract>;

  const mockContractRepository = {
    findOne: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractService,
        {
          provide: getRepositoryToken(Contract),
          useValue: mockContractRepository,
        },
      ],
    }).compile();

    service = module.get<ContractService>(ContractService);
    contractRepository = module.get<Repository<Contract>>(getRepositoryToken(Contract));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findContractById', () => {
    it('should return a contract if found', async () => {
      const contract = new Contract();
      contract.id = 1;
      contract.status = ContractStatus.IN_PROGRESS;

      mockContractRepository.findOne.mockResolvedValue(contract);

      const result = await service.findContractById(1, 1);

      expect(result).toEqual(contract);
      expect(contractRepository.findOne).toHaveBeenCalledWith({
        where: [
          { id: 1, contractor: { id: 1 } },
          { id: 1, client: { id: 1 } },
        ],
      });
    });

    it('should throw a NotFoundException if contract is not found', async () => {
      mockContractRepository.findOne.mockResolvedValue(null);

      await expect(service.findContractById(1, 1)).rejects.toThrow('Contract not found');
      expect(contractRepository.findOne).toHaveBeenCalledWith({
        where: [
          { id: 1, contractor: { id: 1 } },
          { id: 1, client: { id: 1 } },
        ],
      });
    });
  });

  describe('findProfileContracts', () => {
    it('should return a paginated list of contracts', async () => {
      const contracts = [new Contract(), new Contract()];
      const total = 2;

      mockContractRepository.findAndCount.mockResolvedValue([contracts, total]);

      const query: PaginationDto = {
        page: 1,
        limit: 10,
        skip: 0,
      };

      const result = await service.findProfileContracts(1, query);

      expect(result).toEqual(
        new PaginationResultDto(contracts, {
          itemCount: total,
          pageOptionsDto: query,
        })
      );
      expect(contractRepository.findAndCount).toHaveBeenCalledWith({
        where: [
          { contractor: { id: 1 }, status: expect.any(Object) },
          { client: { id: 1 }, status: expect.any(Object) },
        ],
        take: query.limit,
        skip: query.skip,
        order: { createdAt: query.order },
      });
    });
  });
});
