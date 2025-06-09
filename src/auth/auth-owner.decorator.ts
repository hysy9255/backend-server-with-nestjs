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
import { OwnerMapper } from 'src/user/mapper/owner.mapper';
import { UserOrmEntity } from 'src/user/orm-entities/user.orm.entity';

export const AuthOwner = createParamDecorator(
  async (_, context: ExecutionContext): Promise<OwnerEntity> => {
    const gqlContext = GqlExecutionContext.create(context).getContext();

    // const domainUser: DriverEntity | CustomerEntity | OwnerEntity =
    //   gqlContext['domainUser'];

    // console.log('from decorator', domainUser);

    const userRecord: UserOrmEntity = gqlContext['userRecord'];
    const userService: UserService = gqlContext.req.userService;

    const owner = await userService.findOwnerByUserId(userRecord.id);
    if (!owner) throw new ForbiddenException();

    return owner;

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
