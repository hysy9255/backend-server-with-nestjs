import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CustomerEntity } from 'src/user/domain/customer.entity';
import { UserService } from 'src/user/application/service/user.service';
import { UserOrmEntity } from 'src/user/infrastructure/orm-entities/user.orm.entity';
import { UserSummaryProjection } from 'src/user/application/query/projections/user.projection';

export const AuthCustomer = createParamDecorator(
  async (_, context: ExecutionContext): Promise<CustomerEntity> => {
    const gqlContext = GqlExecutionContext.create(context).getContext();

    const user: UserSummaryProjection = gqlContext['user'];
    const userService: UserService = gqlContext.req.userService;

    const customer = await userService.findCustomerByUserId(user.id);
    if (!customer) throw new ForbiddenException();

    return customer;
  },
);
