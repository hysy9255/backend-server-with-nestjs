import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { DriverEntity } from 'src/user/domain/driver.entity';
import { UserAuthService } from 'src/user/application/service/user-auth.service';
import { UserQueryProjection } from 'src/user/infrastructure/repositories/query/user-query.repository.interface';

export const AuthDriver = createParamDecorator(
  async (_, context: ExecutionContext): Promise<DriverEntity> => {
    const gqlContext = GqlExecutionContext.create(context).getContext();

    const user: UserQueryProjection = gqlContext['user'];
    const userAuthService: UserAuthService = gqlContext.req.userAuthService;

    const driver = await userAuthService.getDriverForAuth(user.id);
    if (!driver) throw new ForbiddenException('Driver Not Found');

    return driver;
  },
);
