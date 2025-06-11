import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { DriverEntity } from 'src/user/domain/driver.entity';
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
  },
);
