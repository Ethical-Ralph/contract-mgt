import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RequestHeadersEnum } from '../enums';
import { ErrorHelper } from '../utils';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<any> {
    const req = context.switchToHttp().getRequest();

    const authorization = req.headers[RequestHeadersEnum.Authorization];

    if (!authorization) {
      ErrorHelper.UnauthorizedException('Authorization header is missing');
    }

    const profile = 'profile';

    req.profile = profile;

    return true;
  }
}
