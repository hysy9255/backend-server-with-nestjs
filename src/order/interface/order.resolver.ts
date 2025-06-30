import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { ClientOrderService } from '../application/service/clientOrder.service';
import { OwnerOrderService } from '../application/service/ownerOrder.service';
import { DriverOrderService } from '../application/service/driverOrder.service';
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
} from './dtos/graphql/order-output.gql.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UserQueryProjection } from 'src/user/infrastructure/repositories/query/user-query.repository.interface';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import {
  ClientOrderSummaryProjection,
  DriverOrderSummaryProjection,
  OwnerOrderSummaryProjection,
} from '../infrastructure/repositories/query/projections/order.projection';
import { UserRole } from 'src/constants/userRole';
import { shouldNotifySubscriber } from '../application/util/order-noti-filter';

@Resolver()
export class OrderSubscriptionResolver {
  constructor(@Inject('PUB_SUB') private readonly pubSub: PubSub) {}

  @Subscription((returns) => GqlOwnerOrderSummaryDTO, {
    filter: (payload, variables, context) => {
      // if (payload.order.ownerId === context.ownerId) {
      //   return true;
      // }

      return true;
    },
    resolve: (data) => {
      return new GqlOwnerOrderSummaryDTO(data.ownerOrderSummaryProjection);
    },
  })
  newOrder() {
    return this.pubSub.asyncIterableIterator('NEW_ORDER');
  }

  @Subscription(() => Boolean, {
    filter: (payload, variables, context) => {
      // if (payload.order.ownerId === context.ownerId) {
      //   return true
      // }
      return true;
    },
    resolve: (data) => {
      return data;
    },
  })
  @Role(['Owner'])
  orderUpdateForOwner() {
    return this.pubSub.asyncIterableIterator('ORDER_UPDATE_FOR_OWNER');
  }

  @Subscription(() => Boolean, {
    filter: (payload, variables, context) => {
      // if (payload.order.customerId === context.customerId) {
      //   return true
      // }
      return true;
    },
    resolve: (data) => {
      return data;
    },
  })
  @Role(['Client'])
  orderUpdateForClient(@Args('orderId') orderId: string) {
    return this.pubSub.asyncIterableIterator('ORDER_UPDATE_FOR_CLIENT');
  }

  @Subscription(() => Boolean, {
    filter: (payload, variables, context) => {
      // if (payload.order.driverId === context.driverId) {
      //   return true
      // }
      return true;
    },
    resolve: (data) => {
      return data;
    },
  })
  @Role(['Delivery'])
  orderUpdateForDriver(@Args('orderId') orderId: string) {
    return this.pubSub.asyncIterableIterator('ORDER_UPDATE_FOR_DRIVER');
  }
}

@Resolver()
export class ClientOrderResolver {
  constructor(private readonly clientOrderService: ClientOrderService) {}

  // used
  @Mutation(() => Boolean)
  @Role(['Client'])
  async createOrder(
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
    @AuthUser() user: UserQueryProjection,
  ): Promise<GqlClientOrderPreviewDTO[]> {
    const orders = await this.clientOrderService.getOrderHistory(user);
    return orders.map((order) => new GqlClientOrderPreviewDTO(order));
  }

  // used
  @Query(() => GqlClientOrderSummaryDTO)
  @Role(['Client'])
  async getOrderForClient(
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
    @AuthUser() user: UserQueryProjection,
  ): Promise<GqlOwnerOrderSummaryDTO[]> {
    const orders = await this.ownerOrderService.getOrders(user);
    return orders.map((order) => new GqlOwnerOrderSummaryDTO(order));
  }

  // used
  @Query(() => GqlOwnerOrderSummaryDTO)
  @Role(['Owner'])
  async getOrderForOwner(
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
    @AuthUser() user: UserQueryProjection,
  ): Promise<GqlDriverOrderSummaryDTO[]> {
    const orders = await this.driverOrderService.getOrdersForDriver(user);
    return orders.map((order) => new GqlDriverOrderSummaryDTO(order));
  }

  // used
  @Query(() => GqlDriverOrderSummaryDTO)
  @Role(['Delivery'])
  async getOrderForDriver(
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
    @AuthUser() user: UserQueryProjection,
    @Args('input') { orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.driverOrderService.completeDelivery(orderId, user);
    return true;
  }
}
