import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { OwnerEntity } from 'src/user/domain/owner.entity';
import { UserSummaryProjection } from 'src/user/application/query/projections/user.projection';
import { UserAuthService } from 'src/user/application/service/user-auth.service';

export const AuthOwner = createParamDecorator(
  async (_, context: ExecutionContext): Promise<OwnerEntity> => {
    const gqlContext = GqlExecutionContext.create(context).getContext();

    const user: UserSummaryProjection = gqlContext['user'];
    const userAuthService: UserAuthService = gqlContext.req.userAuthService;

    const owner = await userAuthService.getOwnerForAuth(user.id);
    if (!owner) throw new ForbiddenException('Owner Not Found');

    return owner;
  },
);
