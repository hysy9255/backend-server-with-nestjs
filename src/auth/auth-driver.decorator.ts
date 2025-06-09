import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserMapper } from 'src/user/mapper/user.mapper';
import { UserEntity } from 'src/user/domain/user.entity';

import { UserRole } from 'src/constants/userRole';
import { CustomerMapper } from 'src/user/mapper/customer.mapper';
import { DriverEntity } from 'src/user/domain/driver.entity';
import { CustomerEntity } from 'src/user/domain/customer.entity';
import { OwnerEntity } from 'src/user/domain/owner.entity';
import { UserService } from 'src/user/user.service';
import { UserOrmEntity } from 'src/user/orm-entities/user.orm.entity';

export const AuthDriver = createParamDecorator(
  async (_, context: ExecutionContext): Promise<DriverEntity> => {
    const gqlContext = GqlExecutionContext.create(context).getContext();

    const userRecord: UserOrmEntity = gqlContext['userRecord'];
    const userService: UserService = gqlContext.req.userService;

    const driver = await userService.findDriverByUserId(userRecord.id);
    if (!driver) throw new ForbiddenException();

    return driver;
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
