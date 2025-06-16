import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CustomerEntity } from 'src/user/domain/customer.entity';
import { UserAuthService } from 'src/user/application/service/user-auth.service';
import { UserQueryProjection } from 'src/user/infrastructure/repositories/query/user-query.repository.interface';

export const AuthCustomer = createParamDecorator(
  async (_, context: ExecutionContext): Promise<CustomerEntity> => {
    const gqlContext = GqlExecutionContext.create(context).getContext();

    const user: UserQueryProjection = gqlContext['user'];
    const userAuthService: UserAuthService = gqlContext.req.userAuthService;

    const customer = await userAuthService.getCustomerForAuth(user.id);
    if (!customer) throw new ForbiddenException('Customer Not Found');

    return customer;
  },
);
