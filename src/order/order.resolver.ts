import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { ClientOrderService } from './services/clientOrder.service';
import { DriverOrderService } from './services/driverOrder.service';
import { RestaurantOrderService } from './services/restaurantOrder.service';
import { OrderDTO } from './dtos/order.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UserEntity } from 'src/user/domain/user.entity';
import { ClientGetOrderInput } from './dtos/clientGetOrder.dto';
import { CustomerEntity } from 'src/user/domain/customer.entity';

@Resolver()
export class OrderResolver {
  constructor(
    private readonly clientOrderService: ClientOrderService,
    // private readonly driverOrderService: DriverOrderService,
    // private readonly restaurantOrderService: RestaurantOrderService,
  ) {}

  @Query(() => OrderDTO)
  async getOrder(
    @AuthUser() customer: CustomerEntity,
    @Args('input') { orderId }: ClientGetOrderInput,
  ) {
    return this.clientOrderService.getOrder(customer, orderId);
  }
}
