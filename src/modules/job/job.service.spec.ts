import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JobService } from './job.service';
import { Job } from './entities/job.entity';
import { Profile } from '../base/entities/profile.entity';
import { PaginationDto, PaginationResultDto } from '../../base/pagination';

describe('JobService', () => {
  let service: JobService;

  const mockJobRepository = {
    createQueryBuilder: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
    manager: {
      findOne: jest.fn(),
      save: jest.fn(),
      transaction: jest.fn(),
    },
  };

  const mockProfileRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobService,
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

    service = module.get<JobService>(JobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findUnpaidJobsForUser', () => {
    it('should return paginated list of unpaid jobs', async () => {
      const jobs = [new Job(), new Job()];
      const total = 2;
      const query: PaginationDto = { page: 1, limit: 10, skip: 0 };

      mockJobRepository.createQueryBuilder().getManyAndCount.mockResolvedValue([jobs, total]);

      const result = await service.findUnpaidJobsForUser(1, query);

      expect(result).toEqual(
        new PaginationResultDto(jobs, {
          itemCount: total,
          pageOptionsDto: query,
        })
      );
      expect(mockJobRepository.createQueryBuilder).toHaveBeenCalledWith('job');
      expect(mockJobRepository.createQueryBuilder().innerJoin).toHaveBeenCalledWith(
        'job.contract',
        'contract'
      );
      expect(mockJobRepository.createQueryBuilder().innerJoin).toHaveBeenCalledWith(
        'contract.client',
        'client'
      );
      expect(mockJobRepository.createQueryBuilder().innerJoin).toHaveBeenCalledWith(
        'contract.contractor',
        'contractor'
      );
    });
  });

  describe('payForJob', () => {
    it('should complete job payment if valid', async () => {
      const job = new Job();
      job.id = 1;
      job.isPaid = false;
      job.contract = { client: { id: 1, balance: 1000 }, contractor: { id: 2 } } as any;
      job.price = 500;

      const client = new Profile();
      client.id = 1;
      client.balance = 1000;

      const contractor = new Profile();
      contractor.id = 2;
      contractor.balance = 500;

      mockJobRepository.manager.findOne.mockImplementation(async (entity, options) => {
        if (entity === Job) return job;
        if (entity === Profile) {
          if (options.where.id === 1) return client;
          if (options.where.id === 2) return contractor;
        }
        return null;
      });

      mockJobRepository.manager.save.mockResolvedValue(null);
      mockJobRepository.manager.transaction.mockImplementation(async cb =>
        cb(mockJobRepository.manager)
      );

      await service.payForJob(1, 1);

      expect(job.isPaid).toBe(true);
      expect(job.paidDate).toBeInstanceOf(Date);
      expect(client.balance).toBe(500);
      expect(contractor.balance).toBe(1000);

      expect(mockJobRepository.manager.save).toHaveBeenCalledWith(Profile, client);
      expect(mockJobRepository.manager.save).toHaveBeenCalledWith(Profile, contractor);
      expect(mockJobRepository.manager.save).toHaveBeenCalledWith(Job, job);
    });

    it('should throw error if job is already paid', async () => {
      const job = new Job();
      job.id = 1;
      job.isPaid = true;
      job.price = 500;

      mockJobRepository.manager.findOne.mockResolvedValue(job);

      await expect(service.payForJob(1, 1)).rejects.toThrow('Job is already paid');
    });

    it('should throw error if client has insufficient balance', async () => {
      const job = new Job();
      job.id = 1;
      job.isPaid = false;
      job.contract = { client: { id: 1, balance: 200 }, contractor: { id: 2 } } as any;
      job.price = 500;

      const client = new Profile();
      client.id = 1;
      client.balance = 200;

      mockJobRepository.manager.findOne.mockResolvedValueOnce(job).mockResolvedValueOnce(client);

      await expect(service.payForJob(1, 1)).rejects.toThrow('Insufficient balance');
    });

    it('should throw error if client is not found', async () => {
      const job = new Job();
      job.id = 1;
      job.isPaid = false;
      job.contract = { client: { id: 1 }, contractor: { id: 2 } } as any;

      mockJobRepository.manager.findOne.mockResolvedValueOnce(job).mockResolvedValueOnce(null);

      await expect(service.payForJob(1, 1)).rejects.toThrow('Client not found');
    });
  });
});
