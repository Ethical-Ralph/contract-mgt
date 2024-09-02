import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseService } from './base.service';
import { BaseController } from './base.controller';
import { Job } from '../job/entities/job.entity';
import { Profile } from './entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job, Profile])],
  controllers: [BaseController],
  providers: [BaseService],
})
export class BaseModule {}
