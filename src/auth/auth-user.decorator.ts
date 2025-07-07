import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ContextType } from '@nestjs/common';
import { UserInfoProjection } from 'src/user/infrastructure/repositories/query/user.info.projection';

export const AuthUser = createParamDecorator(
  async (_, context: ExecutionContext): Promise<UserInfoProjection> => {
    let userInfo: UserInfoProjection;

    if (context.getType() === ('graphql' as ContextType)) {
      const gqlContext = GqlExecutionContext.create(context).getContext();
      userInfo = gqlContext.req['userInfo'];
    } else {
      const req = context.switchToHttp().getRequest();
      userInfo = req.userInfo;
    }

    if (!userInfo) {
      throw new ForbiddenException('User not authenticated');
    }

    return userInfo;
  },
);
