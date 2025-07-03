import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { AllowedRoles } from './role.decorator';
import { UserQueryProjection } from 'src/user/infrastructure/repositories/query/user/user-query.repository.interface';
import { UserInfoProjection } from 'src/user/infrastructure/repositories/query/user.info.projection';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<AllowedRoles>(
      'roles',
      context.getHandler(),
    );

    if (!roles) {
      return true;
    }

    if (roles.includes('Any')) return true;

    // let user: UserQueryProjection | undefined;
    let userInfo: UserInfoProjection | undefined;

    if (context.getType<GqlContextType>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context).getContext();
      // user = gqlContext.req?.user;
      userInfo = gqlContext.req?.userInfo;
      console.log('this is from auth guard:', userInfo);
    } else {
      const req = context.switchToHttp().getRequest();
      // user = req.user;
      userInfo = req.userInfo;
    }

    // if (!user) return false;
    if (!userInfo) return false;

    // return roles.includes(user.role);
    return roles.includes(userInfo.role);
  }
}
