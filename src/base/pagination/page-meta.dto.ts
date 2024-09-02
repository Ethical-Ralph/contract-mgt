import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDtoParameters } from '../../interfaces/pagination.interface';

export class PaginationMetadataDto {
  @ApiProperty({ example: 1, description: 'Current page number' })
  readonly page: number;

  @ApiProperty({ example: 10, description: 'Number of items per page' })
  readonly limit: number;

  @ApiProperty({ example: 100, description: 'Total number of items' })
  readonly itemCount: number;

  @ApiProperty({ example: 10, description: 'Total number of pages' })
  readonly pageCount: number;

  @ApiProperty({ example: true, description: 'Indicates if there is a previous page' })
  readonly hasPreviousPage: boolean;

  @ApiProperty({ example: true, description: 'Indicates if there is a next page' })
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    this.page = pageOptionsDto.page;
    this.limit = pageOptionsDto.limit;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.limit);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
