import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { AllowedRoles } from './role.decorator';
import { UserOrmEntity } from 'src/user/orm-entities/user.orm.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<AllowedRoles>(
      'roles',
      context.getHandler(),
    );

    // if (!roles) {
    //   return true;
    // }

    // let req: any;

    // GraphQL 요청인지 확인
    if (context.getType<GqlContextType>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context).getContext();
      const userRecord: UserOrmEntity = gqlContext.req?.user;
      gqlContext['userRecord'] = userRecord;

      if (roles.includes('Any')) {
        console.log('roles:', roles);
        return true;
      }
      return roles.includes(userRecord.role);
    } else {
      // HTTP 요청 (REST)
      // req = context.switchToHttp().getRequest();
    }

    return false;
  }
}
