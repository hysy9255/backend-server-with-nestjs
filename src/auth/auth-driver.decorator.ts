import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { DriverEntity } from 'src/user/domain/driver.entity';
import { UserService } from 'src/user/application/service/user.service';
import { UserOrmEntity } from 'src/user/infrastructure/orm-entities/user.orm.entity';
import { UserSummaryProjection } from 'src/user/application/query/projections/user.projection';

export const AuthDriver = createParamDecorator(
  async (_, context: ExecutionContext): Promise<DriverEntity> => {
    const gqlContext = GqlExecutionContext.create(context).getContext();

    const user: UserSummaryProjection = gqlContext['user'];
    const userService: UserService = gqlContext.req.userService;

    const driver = await userService.findDriverByUserId(user.id);
    if (!driver) throw new ForbiddenException();

    return driver;
  },
);
