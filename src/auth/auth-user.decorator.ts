import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserMapper } from 'src/user/application/service/mapper/user.mapper';
import { UserEntity } from 'src/user/domain/user.entity';
import { UserRole } from 'src/constants/userRole';

import { DriverEntity } from 'src/user/domain/driver.entity';
import { CustomerEntity } from 'src/user/domain/customer.entity';
import { OwnerEntity } from 'src/user/domain/owner.entity';

export const AuthUser = createParamDecorator(
  (_, context: ExecutionContext): UserEntity => {
    const gqlContext = GqlExecutionContext.create(context).getContext();

    const userRecord = gqlContext['userRecord'];

    return UserMapper.toDomain(userRecord);

    // const domainUser: DriverEntity | CustomerEntity | OwnerEntity =
    //   gqlContext['domainUser'];

    // console.log('from decorator', domainUser);

    // return domainUser;
    // let userRecord: UserRecord;
    // // GraphQL context
    // if (context.getType<'graphql'>() === 'graphql') {
    //   const gqlCtx = GqlExecutionContext.create(context);
    //   userRecord = gqlCtx.getContext().req.user;
    // } else {
    //   // HTTP context
    //   const request = context.switchToHttp().getRequest();
    //   userRecord = request.user;
    // }
    // // if (userRecord.role === UserRole.Client) {
    // //   CustomerMapper.toDomain(userRecord)
    // // }
    // return UserMapper.toDomain(userRecord);
  },
);
