/* eslint-disable max-classes-per-file */
import { IsDateString, IsNumber, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DateRangeDto {
  @ApiProperty({
    description: 'Start date in yyyy-mm-dd format',
    example: '2024-01-01',
  })
  @IsDateString()
  start: string;

  @ApiProperty({
    description: 'End date in yyyy-mm-dd format',
    example: '2024-12-31',
  })
  @IsDateString()
  end: string;
}

export class DateRangePlusLimitDto extends DateRangeDto {
  @ApiProperty({
    description: 'Limit the number of results',
    example: 2,
  })
  @IsNumberString()
  limit: number;
}
