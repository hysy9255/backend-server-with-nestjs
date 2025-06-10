import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { OwnerEntity } from 'src/user/domain/owner.entity';
import { UserService } from 'src/user/user.service';
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
