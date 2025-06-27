import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { AllowedRoles } from './role.decorator';
import { UserQueryProjection } from 'src/user/infrastructure/repositories/query/user-query.repository.interface';

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

    let user: UserQueryProjection | undefined;

    if (context.getType<GqlContextType>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context).getContext();
      user = gqlContext.req?.user;
    } else {
      const req = context.switchToHttp().getRequest();
      user = req.user;
    }

    if (!user) return false;

    return roles.includes(user.role);
  }
}
