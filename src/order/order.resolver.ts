import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ClientOrderService } from './services/clientOrder.service';
import { OrderDTO, OrderDTOForOwner } from './dtos/order.dto';
import { CustomerEntity } from 'src/user/domain/customer.entity';
import { CreateOrderInput } from './dtos/createOrder.dto';
import { AuthCustomer } from 'src/auth/auth-customer.decorator';
import { AuthOwner } from 'src/auth/auth-owner.decorator';
import { OwnerEntity } from 'src/user/domain/owner.entity';
import { OwnerOrderService } from './services/ownerOrder.service';
import { AcceptOrderInput } from './dtos/acceptOrder.dto';
import { RejectOrderInput } from './dtos/rejectOrder.dto';
import { MarkOrderAsReadyInput } from './dtos/markOrderAsReady.dto';
import { GetOrderByOwnerInput } from './dtos/getOrderByOwner.dto';
import { GetOrderByClientInput } from './dtos/getOrderByClient.dto';
import { DriverOrderService } from './services/driverOrder.service';
import { DriverEntity } from 'src/user/domain/driver.entity';
import { AuthDriver } from 'src/auth/auth-driver.decorator';

@Resolver()
export class ClientOrderResolver {
  constructor(private readonly clientOrderService: ClientOrderService) {}

  @Mutation(() => Boolean)
  createOrder(
    @AuthCustomer() customer: CustomerEntity,
    @Args('input') createOrderInput: CreateOrderInput,
  ): Promise<boolean> {
    return this.clientOrderService.createOrder(customer, createOrderInput);
  }

  @Query(() => OrderDTO)
  getOrderByClient(
    @AuthCustomer() customer: CustomerEntity,
    @Args('input') { orderId }: GetOrderByClientInput,
  ): Promise<OrderDTO> {
    return this.clientOrderService.getOrder(customer, orderId);
  }

  @Query(() => [OrderDTO])
  getOrderHistory(
    @AuthCustomer() customer: CustomerEntity,
  ): Promise<OrderDTO[]> {
    return this.clientOrderService.getOrderHistory(customer);
  }
}

@Resolver()
export class OwnerOrderResolver {
  constructor(private readonly ownerOrderService: OwnerOrderService) {}

  @Query(() => [OrderDTOForOwner])
  getOrdersByOwner(
    @AuthOwner() owner: OwnerEntity,
  ): Promise<OrderDTOForOwner[]> {
    return this.ownerOrderService.getOrders(owner);
  }

  @Query(() => OrderDTOForOwner)
  getOrderByOwner(
    @AuthOwner() owner: OwnerEntity,
    @Args('input') { orderId }: GetOrderByOwnerInput,
  ): Promise<OrderDTOForOwner> {
    return this.ownerOrderService.getOrder(orderId, owner);
  }

  @Mutation(() => Boolean)
  async acceptOrderByOwner(
    @AuthOwner() owner: OwnerEntity,
    @Args('input') { orderId }: AcceptOrderInput,
  ): Promise<boolean> {
    await this.ownerOrderService.acceptOrder(orderId, owner);
    return true;
  }

  @Mutation(() => Boolean)
  async rejectOrderByOwner(
    @AuthOwner() owner: OwnerEntity,
    @Args('input') { orderId }: RejectOrderInput,
  ): Promise<boolean> {
    await this.ownerOrderService.rejectOrder(orderId, owner);
    return true;
  }

  @Mutation(() => Boolean)
  async markOrderAsReadyByOwner(
    @AuthOwner() owner: OwnerEntity,
    @Args('input') { orderId }: MarkOrderAsReadyInput,
  ): Promise<boolean> {
    await this.ownerOrderService.markOrderAsReady(orderId, owner);
    return true;
  }
}

@Resolver()
export class DriverOrderResolver {
  constructor(private readonly driverOrderService: DriverOrderService) {}

  @Query(() => [OrderDTO])
  getOrdersByDriver(@AuthDriver() driver: DriverEntity): Promise<OrderDTO[]> {
    return this.driverOrderService.getAvailableOrders(driver);
  }

  // @Query(() => OrderDTOForOwner)
  // getOrderByOwner(
  //   @AuthOwner() owner: OwnerEntity,
  //   @Args('input') { orderId }: GetOrderByOwnerInput,
  // ): Promise<OrderDTOForOwner> {
  //   return this.ownerOrderService.getOrder(orderId, owner);
  // }

  @Mutation(() => Boolean)
  async acceptOrderByDriver(
    @AuthDriver() driver: DriverEntity,
    @Args('input') { orderId }: AcceptOrderInput,
  ): Promise<boolean> {
    await this.driverOrderService.acceptOrder(orderId, driver);
    return true;
  }

  @Mutation(() => Boolean)
  async rejectOrderByDriver(
    @AuthDriver() driver: DriverEntity,
    @Args('input') { orderId }: RejectOrderInput,
  ): Promise<boolean> {
    await this.driverOrderService.rejectOrder(orderId, driver);
    return true;
  }

  // @Mutation(() => Boolean)
  // async markOrderAsReadyByOwner(
  //   @AuthOwner() owner: OwnerEntity,
  //   @Args('input') { orderId }: MarkOrderAsReadyInput,
  // ): Promise<boolean> {
  //   await this.ownerOrderService.markOrderAsReady(orderId, owner);
  //   return true;
  // }
}
