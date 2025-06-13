import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserSummaryProjection } from 'src/user/application/query/projections/user.projection';
import { UserAuthService } from 'src/user/application/service/user-auth.service';
import { UserEntity } from 'src/user/domain/user.entity';

export const AuthUser = createParamDecorator(
  async (_, context: ExecutionContext): Promise<UserEntity> => {
    const gqlContext = GqlExecutionContext.create(context).getContext();

    const userReadModel: UserSummaryProjection = gqlContext['user'];
    const userAuthService: UserAuthService = gqlContext.req.userAuthService;

    const user = await userAuthService.getUserForAuth(userReadModel.id);
    if (!user) throw new ForbiddenException('User Not Found');

    return user;
  },
);
