import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { HttpResponse } from '../../utils';
import { DateRangeDto, DateRangePlusLimitDto } from './dto/admin.dto';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('best-profession')
  @ApiOkResponse({
    description: 'The profession that earned the most money in the specified date range',
  })
  async getBestProfession(@Query() query: DateRangeDto): Promise<any> {
    const data = await this.adminService.getBestProfession(query);

    return HttpResponse.success({ data, message: 'Best profession fetched successfully' });
  }

  @Get('best-clients')
  @ApiOkResponse({ description: 'Clients who paid the most for jobs within the specified period' })
  async getBestClients(@Query() query: DateRangePlusLimitDto): Promise<any> {
    const data = await this.adminService.getBestClients(query);

    return HttpResponse.success({ data, message: 'Best clients fetched successfully' });
  }
}
