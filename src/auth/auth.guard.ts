// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { GqlExecutionContext } from '@nestjs/graphql';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   canActivate(context: ExecutionContext) {
//     const gqlContext = GqlExecutionContext.create(context).getContext();
//     const user = gqlContext.req.user;
//     if (!user) {
//       return false;
//     }
//     return true;
//   }
// }

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    let req: any;

    // GraphQL 요청인지 확인
    if (context.getType<GqlContextType>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context).getContext();
      req = gqlContext.req;
    } else {
      // HTTP 요청 (REST)
      req = context.switchToHttp().getRequest();
    }

    const user = req.user;

    if (!user) {
      return false;
    }
    return true;
  }
}
