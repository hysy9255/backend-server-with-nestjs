import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { AllowedRoles } from './role.decorator';
import { UserQueryProjection } from 'src/user/infrastructure/repositories/query/user-query.repository.interface';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private readonly reflector: Reflector) {}
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const roles = this.reflector.get<AllowedRoles>(
//       'roles',
//       context.getHandler(),
//     );

//     if (!roles) {
//       return true;
//     }

//     // let req: any;

//     // GraphQL 요청인지 확인
//     if (context.getType<GqlContextType>() === 'graphql') {
//       const gqlContext = GqlExecutionContext.create(context).getContext();
//       const user: UserQueryProjection = gqlContext.req?.user;
//       gqlContext['user'] = user;

//       if (roles.includes('Any')) {
//         return true;
//       }
//       return roles.includes(user.role);
//     } else {
//       // HTTP 요청 (REST)
//       // req = context.switchToHttp().getRequest();
//     }

//     return false;
//   }
// }

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
      // gqlContext['user'] = user;
      // console.log('GraphQL request user:', user);
    } else {
      const req = context.switchToHttp().getRequest();
      user = req.user;
      // console.log('HTTP request user:', user);
    }

    if (!user) return false;

    return roles.includes(user.role);
  }
}
