import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CustomerEntity } from 'src/user/domain/customer.entity';
import { UserSummaryProjection } from 'src/user/application/query/projections/user.projection';
import { UserAuthService } from 'src/user/application/service/user-auth.service';

export const AuthCustomer = createParamDecorator(
  async (_, context: ExecutionContext): Promise<CustomerEntity> => {
    const gqlContext = GqlExecutionContext.create(context).getContext();

    const user: UserSummaryProjection = gqlContext['user'];
    const userAuthService: UserAuthService = gqlContext.req.userAuthService;

    const customer = await userAuthService.getCustomerForAuth(user.id);
    if (!customer) throw new ForbiddenException('Customer Not Found');

    return customer;
  },
);
