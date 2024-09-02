import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BaseService } from './base.service';
import { Profile } from './entities/profile.entity';
import { Job } from '../job/entities/job.entity';

describe('BaseService', () => {
  let service: BaseService;
  let jobRepository: Repository<Job>;

  const mockJobRepository = {
    manager: {
      createQueryBuilder: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      transaction: jest.fn(),
    },
  };

  const mockProfileRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BaseService,
        {
          provide: getRepositoryToken(Job),
          useValue: mockJobRepository,
        },
        {
          provide: getRepositoryToken(Profile),
          useValue: mockProfileRepository,
        },
      ],
    }).compile();

    service = module.get<BaseService>(BaseService);
    jobRepository = module.get<Repository<Job>>(getRepositoryToken(Job));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deposit', () => {
    it('should deposit amount successfully and return new balance', async () => {
      const userId = 1;
      const amount = 50;
      const profileId = 1;

      const contractResult = {
        clientId: userId,
        totalOutstandingPayments: '200',
      };

      const profile = { id: userId, balance: 100 } as Profile;

      jest.spyOn(jobRepository.manager, 'createQueryBuilder').mockReturnValue({
        leftJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(contractResult),
      } as any);

      jest.spyOn(jobRepository.manager, 'findOne').mockResolvedValue(profile);
      jest.spyOn(jobRepository.manager, 'save').mockResolvedValue(undefined);
      jest
        .spyOn(jobRepository.manager, 'transaction')
        .mockImplementation((fn: any) => fn(jobRepository.manager));

      const result = await service.deposit(userId, amount, profileId);

      expect(result).toEqual({ newBalance: 150 });
      expect(jobRepository.manager.createQueryBuilder).toHaveBeenCalled();
      expect(jobRepository.manager.findOne).toHaveBeenCalledWith(Profile, {
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      });
      expect(jobRepository.manager.save).toHaveBeenCalledWith(Profile, {
        id: userId,
        balance: 150,
      });
    });

    it('should throw UnauthorizedException if userId does not match profileId', async () => {
      const userId = 1;
      const amount = 50;
      const profileId = 2;

      await expect(service.deposit(userId, amount, profileId)).rejects.toThrow();
    });

    it('should throw NotFoundException if no account is found', async () => {
      const userId = 1;
      const amount = 50;
      const profileId = 1;

      jest.spyOn(jobRepository.manager.createQueryBuilder(), 'getRawOne').mockResolvedValue(null);

      await expect(service.deposit(userId, amount, profileId)).rejects.toThrow();
    });

    it('should throw BadRequestException if deposit amount exceeds limit', async () => {
      const userId = 1;
      const amount = 100;
      const profileId = 1;

      const contractResult = {
        clientId: userId,
        totalOutstandingPayments: '200',
      };

      jest
        .spyOn(jobRepository.manager.createQueryBuilder(), 'getRawOne')
        .mockResolvedValue(contractResult);

      await expect(service.deposit(userId, amount, profileId)).rejects.toThrow();
    });
  });
});
