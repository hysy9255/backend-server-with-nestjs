import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CustomerEntity } from 'src/user/domain/customer.entity';
import { UserService } from 'src/user/user.service';
import { UserOrmEntity } from 'src/user/orm-entities/user.orm.entity';

export const AuthCustomer = createParamDecorator(
  async (_, context: ExecutionContext): Promise<CustomerEntity> => {
    const gqlContext = GqlExecutionContext.create(context).getContext();

    const userRecord: UserOrmEntity = gqlContext['userRecord'];
    const userService: UserService = gqlContext.req.userService;

    const customer = await userService.findCustomerByUserId(userRecord.id);
    if (!customer) throw new ForbiddenException();

    return customer;
  },
);
