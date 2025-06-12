import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { OwnerEntity } from 'src/user/domain/owner.entity';
import { UserService } from 'src/user/application/service/user.service';
import { UserOrmEntity } from 'src/user/infrastructure/orm-entities/user.orm.entity';
import { UserSummaryProjection } from 'src/user/application/query/projections/user.projection';

export const AuthOwner = createParamDecorator(
  async (_, context: ExecutionContext): Promise<OwnerEntity> => {
    const gqlContext = GqlExecutionContext.create(context).getContext();

    const user: UserSummaryProjection = gqlContext['user'];
    const userService: UserService = gqlContext.req.userService;

    const owner = await userService.findOwnerByUserId(user.id);
    if (!owner) throw new ForbiddenException();

    return owner;
  },
);
