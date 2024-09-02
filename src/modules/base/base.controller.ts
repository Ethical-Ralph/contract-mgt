import { Controller } from '@nestjs/common';
import { BaseService } from './base.service';

@Controller('base')
export class BaseController {
  constructor(private readonly baseService: BaseService) {}
}
