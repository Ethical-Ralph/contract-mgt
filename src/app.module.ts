import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envVarsSchema } from './helpers';
import { dataSource } from './database/datasource';
import { JobModule } from './modules/job/job.module';
import { ContractModule } from './modules/contract/contract.module';
import { BaseModule } from './modules/base/base.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: envVarsSchema,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return {};
      },
      dataSourceFactory: () => dataSource.initialize(),
    }),
    ContractModule,
    JobModule,
    BaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
