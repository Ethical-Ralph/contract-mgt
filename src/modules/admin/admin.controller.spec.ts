import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { HttpResponse } from '../../utils';
import { DateRangeDto, DateRangePlusLimitDto } from './dto/admin.dto';

describe('AdminController', () => {
  let controller: AdminController;
  let service: AdminService;

  const mockAdminService = {
    getBestProfession: jest.fn(),
    getBestClients: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: mockAdminService,
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getBestProfession', () => {
    it('should return the best profession', async () => {
      const query: DateRangeDto = { start: '2024-01-01', end: '2024-01-31' };
      const result = { profession: 'Engineer', totalearnings: 10000 };

      jest.spyOn(service, 'getBestProfession').mockResolvedValue(result);

      const response = await controller.getBestProfession(query);

      expect(response).toEqual(
        HttpResponse.success({ data: result, message: 'Best profession fetched successfully' })
      );
      expect(service.getBestProfession).toHaveBeenCalledWith(query);
    });
  });

  describe('getBestClients', () => {
    it('should return the best clients', async () => {
      const query: DateRangePlusLimitDto = {
        start: '2024-01-01',
        end: '2024-01-31',
        limit: 10,
      };
      const result = [
        { clientId: 1, totalpaid: 5000 },
        { clientId: 2, totalpaid: 4000 },
      ];

      jest.spyOn(service, 'getBestClients').mockResolvedValue(result);

      const response = await controller.getBestClients(query);

      expect(response).toEqual(
        HttpResponse.success({ data: result, message: 'Best clients fetched successfully' })
      );
      expect(service.getBestClients).toHaveBeenCalledWith(query);
    });
  });
});
