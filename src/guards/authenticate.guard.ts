import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestHeadersEnum } from '../enums';
import { ErrorHelper } from '../utils';
import { Profile } from '../modules/base/entities/profile.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@InjectRepository(Profile) private profileRepository: Repository<Profile>) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const req = context.switchToHttp().getRequest();

    const authorization = req.headers[RequestHeadersEnum.Authorization];

    if (!authorization) {
      ErrorHelper.UnauthorizedException('Authorization header is missing');
    }

    const profileId = authorization.split(' ')[1];

    if (!profileId) {
      ErrorHelper.UnauthorizedException('Profile ID is missing');
    }

    const profile = await this.profileRepository.findOne({ where: { id: profileId } });

    if (!profile) {
      ErrorHelper.UnauthorizedException('Profile not found');
    }

    req.profile = profile;

    return true;
  }
}
