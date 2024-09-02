import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JobService } from './job.service';
import { PaginatedDto, PaginationDto } from '../../base/pagination';
import { HttpResponse } from '../../utils';
import { JobDto, PaymentDto } from './dto/job.dto';
import { IProfile, Profile } from '../../decorators';
import { AuthGuard } from '../../guards';

@ApiTags('jobs')
@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get('unpaid')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Returns a paginated list of unpaid jobs for the user',
    type: PaginatedDto(JobDto),
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  async getUnpaidJobs(@Profile() profile: IProfile, @Query() query: PaginationDto) {
    const data = await this.jobService.findUnpaidJobsForUser(profile.id, query);

    return HttpResponse.success({ data, message: 'Unpaid jobs found' });
  }

  @Post(':job_id/pay')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'job_id', type: Number, description: 'ID of the job to pay for' })
  @ApiResponse({ status: 200, description: 'Payment successful' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  async payForJob(
    @Param('job_id') jobId: number,
    @Body() paymentDto: PaymentDto,
    @Profile() profile: IProfile
  ) {
    await this.jobService.payForJob(jobId, paymentDto.amount, profile.id);

    return HttpResponse.success({ data: null, message: 'Payment successful' });
  }
}
