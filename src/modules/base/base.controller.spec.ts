import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { BaseController } from './base.controller';
import { BaseService } from './base.service';
import { DepositDto } from './dto/base.dto';
import { HttpResponse } from '../../utils';
import { AuthGuard } from '../../guards';
import { IProfile } from '../../decorators';

describe('BaseController', () => {
  let controller: BaseController;

  const mockBaseService = {
    deposit: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn((_context: ExecutionContext) => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BaseController],
      providers: [
        {
          provide: BaseService,
          useValue: mockBaseService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<BaseController>(BaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('deposit', () => {
    it('should successfully process deposit', async () => {
      const profile: IProfile = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        profession: 'Developer',
        balance: 1000,
        type: 'client',
      };
      const depositDto: DepositDto = { amount: 500 };

      mockBaseService.deposit.mockResolvedValue(undefined);

      const result = await controller.deposit(1, depositDto, profile);

      expect(result).toEqual(
        HttpResponse.success({ data: expect.objectContaining({}), message: 'Deposit successful' })
      );
      expect(mockBaseService.deposit).toHaveBeenCalledWith(1, depositDto.amount, profile.id);
    });
  });
});
