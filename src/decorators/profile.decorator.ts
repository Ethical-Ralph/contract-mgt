import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface IProfile {
  id: number;
  firstName: string;
  lastName: string;
  profession: string;
  balance: number;
  type: 'client' | 'contractor';
}

export const Profile = createParamDecorator<string, ExecutionContext, string | IProfile>(
  (_data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { profile } = request;

    return profile;
  }
);
