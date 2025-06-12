import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ClientOrderService } from '../application/service/clientOrder.service';
import {
  ClientOrderPreviewDTO,
  ClientOrderSummaryDTO,
  DriverOrderSummaryDTO,
  OwnerOrderSummaryDTO,
} from './dtos/order-outputs.dto';
import { CustomerEntity } from 'src/user/domain/customer.entity';
import { AuthCustomer } from 'src/auth/auth-customer.decorator';
import { AuthOwner } from 'src/auth/auth-owner.decorator';
import { OwnerEntity } from 'src/user/domain/owner.entity';
import { OwnerOrderService } from '../application/service/ownerOrder.service';
import { DriverOrderService } from '../application/service/driverOrder.service';
import { DriverEntity } from 'src/user/domain/driver.entity';
import { AuthDriver } from 'src/auth/auth-driver.decorator';
import { Role } from 'src/auth/role.decorator';
import {
  CreateOrderInput,
  GetOrderInput,
  OrderActionInput,
} from './dtos/order-inputs.dto';

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
  @Query(() => ClientOrderSummaryDTO)
  @Role(['Client'])
  async getOnGoingOrderForClient(
    @AuthCustomer() customer: CustomerEntity,
  ): Promise<ClientOrderSummaryDTO> {
    // return await this.clientOrderService.getOnGoingOrder(customer);

    return new ClientOrderSummaryDTO(
      await this.clientOrderService.getOnGoingOrder(customer),
    );
  }

  // used
  @Query(() => [ClientOrderPreviewDTO])
  @Role(['Client'])
  async getOrderHistoryForClient(
    @AuthCustomer() customer: CustomerEntity,
  ): Promise<ClientOrderPreviewDTO[]> {
    // return await this.clientOrderService.getOrderHistory(customer);
    const orders = await this.clientOrderService.getOrderHistory(customer);
    return orders.map((order) => new ClientOrderPreviewDTO(order));
  }

  // used
  @Query(() => ClientOrderSummaryDTO)
  @Role(['Client'])
  async getOrderForClient(
    @AuthCustomer() customer: CustomerEntity,
    @Args('input') { orderId }: GetOrderInput,
  ): Promise<ClientOrderSummaryDTO> {
    return new ClientOrderSummaryDTO(
      await this.clientOrderService.getOrderSummaryForClient(customer, orderId),
    );
  }
}

@Resolver()
export class OwnerOrderResolver {
  constructor(private readonly ownerOrderService: OwnerOrderService) {}

  // used
  @Query(() => [OwnerOrderSummaryDTO])
  @Role(['Owner'])
  async getOrdersForOwner(
    @AuthOwner() owner: OwnerEntity,
  ): Promise<OwnerOrderSummaryDTO[]> {
    // return await this.ownerOrderService.getOrders(owner);
    const orders = await this.ownerOrderService.getOrders(owner);
    return orders.map((order) => new OwnerOrderSummaryDTO(order));

    // const orders = await this.ownerOrderService.getOrders(owner);
    // return orders.map((order) => new OrderSummaryDTOForOwner(order));
  }

  // used
  @Query(() => OwnerOrderSummaryDTO)
  @Role(['Owner'])
  async getOrderForOwner(
    @AuthOwner() owner: OwnerEntity,
    @Args('input') { orderId }: GetOrderInput,
  ): Promise<OwnerOrderSummaryDTO> {
    const order = await this.ownerOrderService.getOrder(owner, orderId);
    return new OwnerOrderSummaryDTO(order);
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
  @Query(() => [DriverOrderSummaryDTO])
  @Role(['Delivery'])
  async getOrdersForDriver(
    @AuthDriver() driver: DriverEntity,
  ): Promise<DriverOrderSummaryDTO[]> {
    const orders = await this.driverOrderService.getOrdersForDriver(driver);
    return orders.map((order) => new DriverOrderSummaryDTO(order));
  }

  // used
  @Query(() => DriverOrderSummaryDTO)
  @Role(['Delivery'])
  async getOrderForDriver(
    @AuthDriver() driver: DriverEntity,
    @Args('input') { orderId }: GetOrderInput,
  ): Promise<DriverOrderSummaryDTO> {
    const order = await this.driverOrderService.getOrderForDriver(
      driver,
      orderId,
    );
    return new DriverOrderSummaryDTO(order);
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
