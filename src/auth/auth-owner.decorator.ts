import {
  ContextType,
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { OwnerEntity } from 'src/user/domain/owner.entity';
import { UserAuthService } from 'src/user/application/service/user-auth.service';
import { UserQueryProjection } from 'src/user/infrastructure/repositories/query/user-query.repository.interface';

// export const AuthOwner = createParamDecorator(
//   async (_, context: ExecutionContext): Promise<OwnerEntity> => {
//     const gqlContext = GqlExecutionContext.create(context).getContext();

//     const user: UserQueryProjection = gqlContext['user'];
//     const userAuthService: UserAuthService = gqlContext.req.userAuthService;

//     const owner = await userAuthService.getOwnerForAuth(user.id);
//     if (!owner) throw new ForbiddenException('Owner Not Found');

//     return owner;
//   },
// );

export const AuthOwner = createParamDecorator(
  async (_, context: ExecutionContext): Promise<OwnerEntity> => {
    let userReadModel: UserQueryProjection;
    let userAuthService: UserAuthService;

    if (context.getType() === ('graphql' as ContextType)) {
      const gqlContext = GqlExecutionContext.create(context).getContext();
      userReadModel = gqlContext.req['user'];
      userAuthService = gqlContext.req.userAuthService;
    } else {
      const req = context.switchToHttp().getRequest();
      userReadModel = req.user;
      userAuthService = req.userAuthService;
    }

    if (!userReadModel || !userReadModel.id) {
      throw new ForbiddenException('User not authenticated');
    }

    const owner = await userAuthService.getOwnerForAuth(userReadModel.id);
    if (!owner) throw new ForbiddenException('Owner Not Found');

    return owner;
  },
);
