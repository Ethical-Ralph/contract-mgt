import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { Job } from './entities/job.entity';
import { Profile } from '../base/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job, Profile])],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}
