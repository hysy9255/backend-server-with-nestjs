import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ClientOrderService } from '../application/service/clientOrder.service';
import { CustomerEntity } from 'src/user/domain/customer.entity';

import { OwnerEntity } from 'src/user/domain/owner.entity';
import { OwnerOrderService } from '../application/service/ownerOrder.service';
import { DriverOrderService } from '../application/service/driverOrder.service';
import { DriverEntity } from 'src/user/domain/driver.entity';
import { Role } from 'src/auth/role.decorator';
import {
  CreateOrderInput,
  GetOrderInput,
  OrderActionInput,
} from './dtos/order-inputs.dto';
import {
  GqlClientOrderPreviewDTO,
  GqlClientOrderSummaryDTO,
  GqlDriverOrderSummaryDTO,
  GqlOwnerOrderSummaryDTO,
} from './dtos/order-output.gql.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UserQueryProjection } from 'src/user/infrastructure/repositories/query/user-query.repository.interface';

@Resolver()
export class ClientOrderResolver {
  constructor(private readonly clientOrderService: ClientOrderService) {}

  // used
  @Mutation(() => Boolean)
  @Role(['Client'])
  async createOrder(
    // @AuthCustomer() customer: CustomerEntity,
    @AuthUser() user: UserQueryProjection,
    @Args('input') createOrderInput: CreateOrderInput,
  ): Promise<boolean> {
    await this.clientOrderService.createOrder(user, createOrderInput);
    return true;
  }

  // used
  @Query(() => GqlClientOrderSummaryDTO)
  @Role(['Client'])
  async getOnGoingOrderForClient(
    // @AuthCustomer() customer: CustomerEntity,
    @AuthUser() user: UserQueryProjection,
  ): Promise<GqlClientOrderSummaryDTO> {
    return new GqlClientOrderSummaryDTO(
      await this.clientOrderService.getOnGoingOrder(user),
    );
  }

  // used
  @Query(() => [GqlClientOrderPreviewDTO])
  @Role(['Client'])
  async getOrderHistoryForClient(
    // @AuthCustomer() customer: CustomerEntity,
    @AuthUser() user: UserQueryProjection,
  ): Promise<GqlClientOrderPreviewDTO[]> {
    // return await this.clientOrderService.getOrderHistory(customer);
    const orders = await this.clientOrderService.getOrderHistory(user);
    return orders.map((order) => new GqlClientOrderPreviewDTO(order));
  }

  // used
  @Query(() => GqlClientOrderSummaryDTO)
  @Role(['Client'])
  async getOrderForClient(
    // @AuthCustomer() customer: CustomerEntity,
    @AuthUser() user: UserQueryProjection,
    @Args('input') { orderId }: GetOrderInput,
  ): Promise<GqlClientOrderSummaryDTO> {
    return new GqlClientOrderSummaryDTO(
      await this.clientOrderService.getOrderSummaryForClient(user, orderId),
    );
  }
}

@Resolver()
export class OwnerOrderResolver {
  constructor(private readonly ownerOrderService: OwnerOrderService) {}

  // used
  @Query(() => [GqlOwnerOrderSummaryDTO])
  @Role(['Owner'])
  async getOrdersForOwner(
    // @AuthOwner() owner: OwnerEntity,
    @AuthUser() user: UserQueryProjection,
  ): Promise<GqlOwnerOrderSummaryDTO[]> {
    // return await this.ownerOrderService.getOrders(owner);
    const orders = await this.ownerOrderService.getOrders(user);
    return orders.map((order) => new GqlOwnerOrderSummaryDTO(order));

    // const orders = await this.ownerOrderService.getOrders(owner);
    // return orders.map((order) => new OrderSummaryDTOForOwner(order));
  }

  // used
  @Query(() => GqlOwnerOrderSummaryDTO)
  @Role(['Owner'])
  async getOrderForOwner(
    // @AuthOwner() owner: OwnerEntity,
    @AuthUser() user: UserQueryProjection,
    @Args('input') { orderId }: GetOrderInput,
  ): Promise<GqlOwnerOrderSummaryDTO> {
    const order = await this.ownerOrderService.getOrder(user, orderId);
    return new GqlOwnerOrderSummaryDTO(order);
  }

  // used
  @Mutation(() => Boolean)
  @Role(['Owner'])
  async acceptOrderByOwner(
    // @AuthOwner() owner: OwnerEntity,
    @AuthUser() user: UserQueryProjection,
    @Args('input') { orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.ownerOrderService.acceptOrder(orderId, user);
    return true;
  }

  // used
  @Mutation(() => Boolean)
  @Role(['Owner'])
  async rejectOrderByOwner(
    // @AuthOwner() owner: OwnerEntity,
    @AuthUser() user: UserQueryProjection,
    @Args('input') { orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.ownerOrderService.rejectOrder(orderId, user);
    return true;
  }

  // used
  @Mutation(() => Boolean)
  @Role(['Owner'])
  async markOrderAsReadyByOwner(
    // @AuthOwner() owner: OwnerEntity,
    @AuthUser() user: UserQueryProjection,
    @Args('input') { orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.ownerOrderService.markOrderAsReady(orderId, user);
    return true;
  }
}

@Resolver()
export class DriverOrderResolver {
  constructor(private readonly driverOrderService: DriverOrderService) {}

  // used
  @Query(() => [GqlDriverOrderSummaryDTO])
  @Role(['Delivery'])
  async getOrdersForDriver(
    // @AuthDriver() driver: DriverEntity,
    @AuthUser() user: UserQueryProjection,
  ): Promise<GqlDriverOrderSummaryDTO[]> {
    const orders = await this.driverOrderService.getOrdersForDriver(user);
    return orders.map((order) => new GqlDriverOrderSummaryDTO(order));
  }

  // used
  @Query(() => GqlDriverOrderSummaryDTO)
  @Role(['Delivery'])
  async getOrderForDriver(
    // @AuthDriver() driver: DriverEntity,
    @AuthUser() user: UserQueryProjection,
    @Args('input') { orderId }: GetOrderInput,
  ): Promise<GqlDriverOrderSummaryDTO> {
    const order = await this.driverOrderService.getOrderForDriver(
      user,
      orderId,
    );
    return new GqlDriverOrderSummaryDTO(order);
  }

  // used
  @Mutation(() => Boolean)
  @Role(['Delivery'])
  async acceptOrderByDriver(
    // @AuthDriver() driver: DriverEntity,
    @AuthUser() user: UserQueryProjection,
    @Args('input') { orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.driverOrderService.acceptOrder(orderId, user);
    return true;
  }

  // used
  @Mutation(() => Boolean)
  @Role(['Delivery'])
  async rejectOrderByDriver(
    // @AuthDriver() driver: DriverEntity,
    @AuthUser() user: UserQueryProjection,
    @Args('input') { orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.driverOrderService.rejectOrder(orderId, user);
    return true;
  }

  // used
  @Mutation(() => Boolean)
  @Role(['Delivery'])
  async pickUpOrderByDriver(
    // @AuthDriver() driver: DriverEntity,
    @AuthUser() user: UserQueryProjection,
    @Args('input') { orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.driverOrderService.pickupOrder(orderId, user);
    return true;
  }

  // used
  @Mutation(() => Boolean)
  @Role(['Delivery'])
  async completeDelivery(
    // @AuthDriver() driver: DriverEntity,
    @AuthUser() user: UserQueryProjection,
    @Args('input') { orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.driverOrderService.completeDelivery(orderId, user);
    return true;
  }
}
