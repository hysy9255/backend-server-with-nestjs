import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { DriverEntity } from 'src/user/domain/driver.entity';
import { UserSummaryProjection } from 'src/user/application/query/projections/user.projection';
import { UserAuthService } from 'src/user/application/service/user-auth.service';

export const AuthDriver = createParamDecorator(
  async (_, context: ExecutionContext): Promise<DriverEntity> => {
    const gqlContext = GqlExecutionContext.create(context).getContext();

    const user: UserSummaryProjection = gqlContext['user'];
    const userAuthService: UserAuthService = gqlContext.req.userAuthService;

    const driver = await userAuthService.getDriverForAuth(user.id);
    if (!driver) throw new ForbiddenException('Driver Not Found');

    return driver;
  },
);
