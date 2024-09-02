import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ContractService } from './contract.service';
import { IProfile, Profile } from '../../decorators';
import { HttpResponse } from '../../utils';
import { ContractDto } from './dto/contract.dto';
import { AuthGuard } from '../../guards';
import { PaginatedDto, PaginationDto } from '../../base/pagination';

@ApiTags('Contract')
@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: Number, description: 'ID of the contract' })
  @ApiResponse({ status: 200, description: 'Returns the contract', type: ContractDto })
  @ApiNotFoundResponse({ description: 'Contract not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  async getContract(@Param('id') id: number, @Profile() profile: IProfile) {
    const contract = await this.contractService.findContractById(id, profile.id);

    return HttpResponse.success({ data: contract, message: 'Contract found' });
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Returns the contracts',
    type: PaginatedDto(ContractDto),
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  async getContracts(@Profile() profile: IProfile, @Query() query: PaginationDto) {
    const contracts = await this.contractService.findProfileContracts(profile.id, query);

    return HttpResponse.success({ data: contracts, message: 'Contracts found' });
  }
}
