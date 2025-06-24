import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserAuthService } from 'src/user/application/service/user-auth.service';
import { UserEntity } from 'src/user/domain/user.entity';
import { UserQueryProjection } from 'src/user/infrastructure/repositories/query/user-query.repository.interface';
import { ContextType } from '@nestjs/common';

// export const AuthUser = createParamDecorator(
//   async (_, context: ExecutionContext): Promise<UserEntity> => {
//     const gqlContext = GqlExecutionContext.create(context).getContext();

//     const userReadModel: UserQueryProjection = gqlContext['user'];
//     const userAuthService: UserAuthService = gqlContext.req.userAuthService;

//     const user = await userAuthService.getUserForAuth(userReadModel.id);
//     if (!user) throw new ForbiddenException('User Not Found');

//     return user;
//   },
// );

export const AuthUser = createParamDecorator(
  async (_, context: ExecutionContext): Promise<UserEntity> => {
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

    // console.log('userReadModel', userReadModel);

    if (!userReadModel || !userReadModel.id) {
      throw new ForbiddenException('User not authenticated');
    }

    const user = await userAuthService.getUserForAuth(userReadModel.id);
    if (!user) throw new ForbiddenException('User not found');

    return user;
  },
);
