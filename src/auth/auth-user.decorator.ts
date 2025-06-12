import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserSummaryProjection } from 'src/user/application/query/projections/user.projection';
import { UserMapper } from 'src/user/application/service/mapper/user.mapper';
import { UserService } from 'src/user/application/service/user.service';
import { UserEntity } from 'src/user/domain/user.entity';

export const AuthUser = createParamDecorator(
  async (_, context: ExecutionContext): Promise<UserEntity> => {
    const gqlContext = GqlExecutionContext.create(context).getContext();

    const userReadModel: UserSummaryProjection = gqlContext['user'];
    const userService: UserService = gqlContext.req.userService;

    const user = await userService.findUserByUserId(userReadModel.id);
    if (!user) throw new ForbiddenException();

    return user;
  },
);
