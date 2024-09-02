import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { Job } from '../job/entities/job.entity';
import { DateRangeDto, DateRangePlusLimitDto } from './dto/admin.dto';

describe('AdminService', () => {
  let service: AdminService;

  const mockJobRepository = {
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getRepositoryToken(Job),
          useValue: mockJobRepository,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBestProfession', () => {
    it('should return the best profession', async () => {
      const query: DateRangeDto = { start: '2024-01-01', end: '2024-01-31' };
      const result = { profession: 'Engineer', totalearnings: 10000 };

      mockJobRepository.createQueryBuilder = jest.fn().mockReturnValue({
        innerJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(result),
      });

      const response = await service.getBestProfession(query);

      expect(response).toEqual(result);
      expect(mockJobRepository.createQueryBuilder).toHaveBeenCalledWith('job');
    });
  });

  describe('getBestClients', () => {
    it('should return the best clients', async () => {
      const query: DateRangePlusLimitDto = { start: '2024-01-01', end: '2024-01-31', limit: 10 };
      const result = [
        { clientId: 1, firstName: 'John', lastName: 'Doe', totalpaid: 5000 },
        { clientId: 2, firstName: 'Jane', lastName: 'Doe', totalpaid: 4000 },
      ];

      mockJobRepository.createQueryBuilder = jest.fn().mockReturnValue({
        innerJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(result),
      });

      const response = await service.getBestClients(query);

      expect(response).toEqual(result);
      expect(mockJobRepository.createQueryBuilder).toHaveBeenCalledWith('job');
    });
  });
});
