import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserMapper } from 'src/user/mapper/user.mapper';
import { UserEntity } from 'src/user/domain/user.entity';

export const AuthUser = createParamDecorator(
  (_, context: ExecutionContext): UserEntity => {
    let userRecord;

    // GraphQL context
    if (context.getType<'graphql'>() === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      userRecord = gqlCtx.getContext().req.user;
    } else {
      // HTTP context
      const request = context.switchToHttp().getRequest();
      userRecord = request.user;
    }

    return UserMapper.toDomain(userRecord);
  },
);
