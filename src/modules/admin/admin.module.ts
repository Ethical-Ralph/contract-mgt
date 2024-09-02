import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Job } from '../job/entities/job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
