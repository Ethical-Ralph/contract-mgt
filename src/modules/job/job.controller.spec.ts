import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { PaginationDto, PaginationResultDto } from '../../base/pagination';
import { JobDto, PaymentDto } from './dto/job.dto';
import { HttpResponse } from '../../utils';
import { IProfile } from '../../decorators';
import { AuthGuard } from '../../guards';

describe('JobController', () => {
  let controller: JobController;

  const mockJobService = {
    findUnpaidJobsForUser: jest.fn(),
    payForJob: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn((_context: ExecutionContext) => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobController],
      providers: [
        {
          provide: JobService,
          useValue: mockJobService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<JobController>(JobController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUnpaidJobs', () => {
    it('should return a paginated list of unpaid jobs', async () => {
      const profile: IProfile = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        profession: 'Developer',
        balance: 1000,
        type: 'client',
      };
      const query: PaginationDto = { page: 1, limit: 10, skip: 0 };

      const paginatedJobs = new PaginationResultDto<JobDto>([], {
        itemCount: 0,
        pageOptionsDto: query,
      });
      mockJobService.findUnpaidJobsForUser.mockResolvedValue(paginatedJobs);

      const result = await controller.getUnpaidJobs(profile, query);

      expect(result).toEqual(
        HttpResponse.success({ data: paginatedJobs, message: 'Unpaid jobs found' })
      );
      expect(mockJobService.findUnpaidJobsForUser).toHaveBeenCalledWith(profile.id, query);
    });
  });

  describe('payForJob', () => {
    it('should successfully process payment', async () => {
      const profile: IProfile = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        profession: 'Developer',
        balance: 1000,
        type: 'client',
      };
      const paymentDto: PaymentDto = { amount: 500 };

      mockJobService.payForJob.mockResolvedValue(undefined);

      const result = await controller.payForJob(1, paymentDto, profile);

      expect(result).toEqual(HttpResponse.success({ data: null, message: 'Payment successful' }));
      expect(mockJobService.payForJob).toHaveBeenCalledWith(1, paymentDto.amount, profile.id);
    });
  });
});
