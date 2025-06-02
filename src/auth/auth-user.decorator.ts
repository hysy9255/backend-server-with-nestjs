import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserMapper } from 'src/user/mapper/user.mapper';
import { UserEntity } from 'src/user/domain/user.entity';
import { UserRecord } from 'src/user/orm-records/user.record';
import { UserRole } from 'src/constants/userRole';
import { CustomerMapper } from 'src/user/mapper/customer.mapper';

export const AuthUser = createParamDecorator(
  (_, context: ExecutionContext): UserEntity => {
    let userRecord: UserRecord;

    // GraphQL context
    if (context.getType<'graphql'>() === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      userRecord = gqlCtx.getContext().req.user;
    } else {
      // HTTP context
      const request = context.switchToHttp().getRequest();
      userRecord = request.user;
    }

    // if (userRecord.role === UserRole.Client) {
    //   CustomerMapper.toDomain(userRecord)
    // }

    return UserMapper.toDomain(userRecord);
  },
);
