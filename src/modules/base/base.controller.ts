import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BaseService } from './base.service';
import { AuthGuard } from '../../guards';
import { DepositDto } from './dto/base.dto';
import { IProfile, Profile } from '../../decorators';
import { HttpResponse } from '../../utils';

@ApiTags('balances')
@Controller('balances')
export class BaseController {
  constructor(private readonly baseService: BaseService) {}

  @Post('/deposit/:userId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'userId', type: Number, description: 'ID of the user to deposit money into' })
  @ApiResponse({ status: 200, description: 'Deposit successful' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  async deposit(
    @Param('userId') userId: number,
    @Body() depositDto: DepositDto,
    @Profile() profile: IProfile
  ) {
    const data = await this.baseService.deposit(userId, depositDto.amount, profile.id);

    return HttpResponse.success({ data, message: 'Deposit successful' });
  }
}
