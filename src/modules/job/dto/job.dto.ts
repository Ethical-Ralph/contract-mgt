/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class JobDto {
  @ApiProperty({
    example: 'c1b6c2b4-6d3b-4c4d-8c5d-0c8b3f8c5c5f',
    description: 'Unique identifier for the job',
  })
  @IsString()
  uuid: string;

  @ApiProperty({ example: 'Clean the office building', description: 'Description of the job' })
  @IsString()
  description: string;

  @ApiProperty({ example: 150.0, description: 'Price of the job' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: false, description: 'Indicates if the job is paid' })
  @IsBoolean()
  isPaid: boolean;

  @ApiProperty({ example: null, description: 'Date when the job was paid', required: false })
  @IsOptional()
  @IsDate()
  paidDate?: Date | null;
}
