import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';
import { HttpResponse } from '../../utils';
import { IProfile } from '../../decorators';
import { ContractDto } from './dto/contract.dto';
import { PaginationDto } from '../../base/pagination';
import { AuthGuard } from '../../guards';
import { ContractStatus } from '../../enums';

describe('ContractController', () => {
  let controller: ContractController;
  let contractService: ContractService;

  const mockContractService = {
    findContractById: jest.fn(),
    findProfileContracts: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn((_context: ExecutionContext) => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractController],
      providers: [
        {
          provide: ContractService,
          useValue: mockContractService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<ContractController>(ContractController);
    contractService = module.get<ContractService>(ContractService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getContract', () => {
    it('should return a contract', async () => {
      const contract: ContractDto = {
        uuid: 'some-uuid',
        terms: 'Contract terms text',
        status: ContractStatus.IN_PROGRESS,
      };

      const profile: IProfile = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        profession: 'Developer',
        balance: 1000,
        type: 'contractor',
      };

      mockContractService.findContractById.mockResolvedValue(contract);

      const result = await controller.getContract(1, profile);

      expect(result).toEqual(HttpResponse.success({ data: contract, message: 'Contract found' }));
      expect(contractService.findContractById).toHaveBeenCalledWith(1, profile.id);
    });

    it('should throw an error if contract is not found', async () => {
      const profile: IProfile = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        profession: 'Developer',
        balance: 1000,
        type: 'contractor',
      };

      mockContractService.findContractById.mockResolvedValue(null);

      try {
        await controller.getContract(1, profile);
      } catch (e) {
        expect(e.message).toEqual('Contract not found');
      }
      expect(contractService.findContractById).toHaveBeenCalledWith(1, profile.id);
    });
  });

  describe('getContracts', () => {
    it('should return a list of contracts', async () => {
      const contracts = {
        data: [
          {
            uuid: 'some-uuid',
            terms: 'Contract terms text',
            status: ContractStatus.IN_PROGRESS,
          },
        ],
        meta: {
          total: 1,
          page: 1,
          limit: 50,
        },
      };

      const profile: IProfile = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        profession: 'Developer',
        balance: 1000,
        type: 'contractor',
      };

      const query: PaginationDto = {
        page: 1,
        limit: 50,
        skip: 0,
      };

      mockContractService.findProfileContracts.mockResolvedValue(contracts);

      const result = await controller.getContracts(profile, query);

      expect(result).toEqual(HttpResponse.success({ data: contracts, message: 'Contracts found' }));
      expect(contractService.findProfileContracts).toHaveBeenCalledWith(profile.id, query);
    });
  });
});
