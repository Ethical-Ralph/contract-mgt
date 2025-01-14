import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class DepositDto {
  @ApiProperty({ example: 100.0, description: 'Amount to deposit' })
  @IsNumber()
  @Min(1)
  amount: number;
}
