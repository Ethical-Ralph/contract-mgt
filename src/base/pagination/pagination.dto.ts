/* eslint-disable max-classes-per-file */
import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/common';
import { PaginationMetadataDto } from './page-meta.dto';
import { PaginationDto } from './page-options.dto';

export class PaginationResultDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true, type: () => Object })
  readonly data: T[];

  @ApiProperty({ type: PaginationMetadataDto })
  readonly meta: PaginationMetadataDto;

  constructor(
    data: T[],
    params: {
      itemCount: number;
      pageOptionsDto: PaginationDto;
    }
  ) {
    const n = new PaginationMetadataDto(params);
    this.data = data;
    this.meta = n;
  }
}

export function PaginatedDto<T>(classRef: Type<T>): Type<PaginationResultDto<T>> {
  class PaginatedDtoClass extends PaginationResultDto<T> {
    @ApiProperty({ isArray: true, type: classRef })
    readonly data: T[];

    @ApiProperty({ type: PaginationMetadataDto })
    readonly meta: PaginationMetadataDto;
  }

  return PaginatedDtoClass;
}
