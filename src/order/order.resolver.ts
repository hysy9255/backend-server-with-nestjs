import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ClientOrderService } from './services/clientOrder.service';
import {
  OrderSummaryDTOForOwner,
  OrderSummaryDTOForClient,
  OrderSummaryDTOForDriver,
  OrderPreviewDTOForClient,
} from './dtos/order.dto';
import { CustomerEntity } from 'src/user/domain/customer.entity';
import { CreateOrderInput } from './dtos/createOrderInput.dto';
import { AuthCustomer } from 'src/auth/auth-customer.decorator';
import { AuthOwner } from 'src/auth/auth-owner.decorator';
import { OwnerEntity } from 'src/user/domain/owner.entity';
import { OwnerOrderService } from './services/ownerOrder.service';
import { DriverOrderService } from './services/driverOrder.service';
import { DriverEntity } from 'src/user/domain/driver.entity';
import { AuthDriver } from 'src/auth/auth-driver.decorator';
import { Role } from 'src/auth/role.decorator';
import { GetOrderInput } from './dtos/getOrderInput.dto';
import { OrderActionInput } from './dtos/orderActionInput.dto';

@Resolver()
export class ClientOrderResolver {
  constructor(private readonly clientOrderService: ClientOrderService) {}

  // used
  @Mutation(() => Boolean)
  @Role(['Client'])
  async createOrder(
    @AuthCustomer() customer: CustomerEntity,
    @Args('input') createOrderInput: CreateOrderInput,
  ): Promise<boolean> {
    await this.clientOrderService.createOrder(customer, createOrderInput);
    return true;
  }

  // used
  @Query(() => OrderSummaryDTOForClient)
  @Role(['Client'])
  async getOnGoingOrderForClient(
    @AuthCustomer() customer: CustomerEntity,
  ): Promise<OrderSummaryDTOForClient> {
    return await this.clientOrderService.getOnGoingOrder(customer);
  }

  // used
  @Query(() => [OrderPreviewDTOForClient])
  @Role(['Client'])
  async getOrderHistoryForClient(
    @AuthCustomer() customer: CustomerEntity,
  ): Promise<OrderPreviewDTOForClient[]> {
    return await this.clientOrderService.getOrderHistory(customer);
  }

  // used
  @Query(() => OrderSummaryDTOForClient)
  @Role(['Client'])
  async getOrderForClient(
    @AuthCustomer() customer: CustomerEntity,
    @Args('input') { orderId }: GetOrderInput,
  ): Promise<OrderSummaryDTOForClient> {
    return await this.clientOrderService.getOrderSummaryForClient(
      customer,
      orderId,
    );
  }
}

@Resolver()
export class OwnerOrderResolver {
  constructor(private readonly ownerOrderService: OwnerOrderService) {}

  // used
  @Query(() => [OrderSummaryDTOForOwner])
  @Role(['Owner'])
  async getOrdersForOwner(
    @AuthOwner() owner: OwnerEntity,
  ): Promise<OrderSummaryDTOForOwner[]> {
    return await this.ownerOrderService.getOrders(owner);

    // const orders = await this.ownerOrderService.getOrders(owner);
    // return orders.map((order) => new OrderSummaryDTOForOwner(order));
  }

  // used
  @Query(() => OrderSummaryDTOForOwner)
  @Role(['Owner'])
  async getOrderForOwner(
    @AuthOwner() owner: OwnerEntity,
    @Args('input') { orderId }: GetOrderInput,
  ): Promise<OrderSummaryDTOForOwner> {
    const order = await this.ownerOrderService.getOrder(owner, orderId);
    return new OrderSummaryDTOForOwner(order);
  }

  // used
  @Mutation(() => Boolean)
  @Role(['Owner'])
  async acceptOrderByOwner(
    @AuthOwner() owner: OwnerEntity,
    @Args('input') { orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.ownerOrderService.acceptOrder(orderId, owner);
    return true;
  }

  // used
  @Mutation(() => Boolean)
  @Role(['Owner'])
  async rejectOrderByOwner(
    @AuthOwner() owner: OwnerEntity,
    @Args('input') { orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.ownerOrderService.rejectOrder(orderId, owner);
    return true;
  }

  // used
  @Mutation(() => Boolean)
  @Role(['Owner'])
  async markOrderAsReadyByOwner(
    @AuthOwner() owner: OwnerEntity,
    @Args('input') { orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.ownerOrderService.markOrderAsReady(orderId, owner);
    return true;
  }
}

@Resolver()
export class DriverOrderResolver {
  constructor(private readonly driverOrderService: DriverOrderService) {}

  // used
  @Query(() => [OrderSummaryDTOForDriver])
  @Role(['Delivery'])
  async getOrdersForDriver(
    @AuthDriver() driver: DriverEntity,
  ): Promise<OrderSummaryDTOForDriver[]> {
    const orders = await this.driverOrderService.getOrdersForDriver(driver);
    return orders.map((order) => new OrderSummaryDTOForDriver(order));
  }

  // used
  @Query(() => OrderSummaryDTOForDriver)
  @Role(['Delivery'])
  async getOrderForDriver(
    @AuthDriver() driver: DriverEntity,
    @Args('input') { orderId }: GetOrderInput,
  ): Promise<OrderSummaryDTOForDriver> {
    const order = await this.driverOrderService.getOrderForDriver(
      driver,
      orderId,
    );
    return new OrderSummaryDTOForDriver(order);
  }

  // used
  @Mutation(() => Boolean)
  @Role(['Delivery'])
  async acceptOrderByDriver(
    @AuthDriver() driver: DriverEntity,
    @Args('input') { orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.driverOrderService.acceptOrder(orderId, driver);
    return true;
  }

  // used
  @Mutation(() => Boolean)
  @Role(['Delivery'])
  async rejectOrderByDriver(
    @AuthDriver() driver: DriverEntity,
    @Args('input') { orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.driverOrderService.rejectOrder(orderId, driver);
    return true;
  }

  // used
  @Mutation(() => Boolean)
  @Role(['Delivery'])
  async pickUpOrderByDriver(
    @AuthDriver() driver: DriverEntity,
    @Args('input') { orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.driverOrderService.pickupOrder(orderId, driver);
    return true;
  }

  // used
  @Mutation(() => Boolean)
  @Role(['Delivery'])
  async completeDelivery(
    @AuthDriver() driver: DriverEntity,
    @Args('input') { orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.driverOrderService.completeDelivery(orderId, driver);
    return true;
  }
}
