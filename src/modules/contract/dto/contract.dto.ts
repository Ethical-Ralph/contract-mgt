import { ApiProperty } from '@nestjs/swagger';
import { ContractStatus } from '../../../enums';

export class ContractDto {
  @ApiProperty({ example: 'some-uuid', description: 'UUID of the contract' })
  uuid: string;

  @ApiProperty({ example: 'Contract terms text', description: 'Terms of the contract' })
  terms: string;

  @ApiProperty({
    example: 'in_progress',
    description: 'Status of the contract',
    enum: ContractStatus,
  })
  status: ContractStatus;
}
