import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { ClientOrderService } from '../application/service/order.external.client.service';
import { OwnerOrderService } from '../application/service/order.external.owner.service';
import { DriverOrderService } from '../application/service/order.external.driver.service';
import { Role } from 'src/auth/role.decorator';
import {
  CreateOrderInput,
  GetOrderInput,
  OrderActionInput,
} from './dtos/inputs/order-inputs.dto';
import {
  GqlClientOrderPreviewDTO,
  GqlClientOrderDTO,
  GqlDriverOrderDTO,
  GqlOwnerOrderDTO,
} from './dtos/outputs/graphql/order-output.dtos';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UserInfoProjection } from 'src/user/infrastructure/repositories/query/user.info.projection';

@Resolver()
export class ClientOrderResolver {
  constructor(private readonly clientOrderService: ClientOrderService) {}

  @Mutation(() => Boolean)
  @Role(['Client'])
  async createOrder(
    @AuthUser() userInfo: UserInfoProjection,
    @Args('input') createOrderInput: CreateOrderInput,
  ): Promise<boolean> {
    await this.clientOrderService.createOrder(userInfo, createOrderInput);
    return true;
  }

  @Query(() => GqlClientOrderDTO)
  @Role(['Client'])
  async getOnGoingOrderForClient(
    @AuthUser() userInfo: UserInfoProjection,
  ): Promise<GqlClientOrderDTO | null> {
    const result = await this.clientOrderService.getOnGoing(userInfo);
    return result ? new GqlClientOrderDTO(result) : null;
  }

  @Query(() => [GqlClientOrderPreviewDTO])
  @Role(['Client'])
  async getOrderHistoryForClient(
    @AuthUser() userInfo: UserInfoProjection,
  ): Promise<GqlClientOrderPreviewDTO[]> {
    const orders = await this.clientOrderService.getHistory(userInfo);
    return orders.map((order) => new GqlClientOrderPreviewDTO(order));
  }

  @Query(() => GqlClientOrderDTO)
  @Role(['Client'])
  async getOrderForClient(
    @AuthUser() userInfo: UserInfoProjection,
    @Args('input') { orderId }: GetOrderInput,
  ): Promise<GqlClientOrderDTO> {
    return new GqlClientOrderDTO(
      await this.clientOrderService.getOrder(userInfo, orderId),
    );
  }
}

@Resolver()
export class OwnerOrderResolver {
  constructor(private readonly ownerOrderService: OwnerOrderService) {}

  @Query(() => [GqlOwnerOrderDTO])
  @Role(['Owner'])
  async getOrdersForOwner(
    @AuthUser() userInfo: UserInfoProjection,
  ): Promise<GqlOwnerOrderDTO[]> {
    const orders = await this.ownerOrderService.getOrders(userInfo);
    return orders.map((order) => new GqlOwnerOrderDTO(order));
  }

  @Query(() => GqlOwnerOrderDTO)
  @Role(['Owner'])
  async getOrderForOwner(
    @AuthUser() userInfo: UserInfoProjection,
    @Args('input') { orderId }: GetOrderInput,
  ): Promise<GqlOwnerOrderDTO> {
    const order = await this.ownerOrderService.getOrder(userInfo, orderId);
    return new GqlOwnerOrderDTO(order);
  }

  @Mutation(() => Boolean)
  @Role(['Owner'])
  async acceptOrderByOwner(
    @AuthUser() userInfo: UserInfoProjection,
    @Args('input') { id: orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.ownerOrderService.accept(orderId, userInfo);
    return true;
  }

  @Mutation(() => Boolean)
  @Role(['Owner'])
  async rejectOrderByOwner(
    @AuthUser() userInfo: UserInfoProjection,
    @Args('input') { id: orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.ownerOrderService.reject(orderId, userInfo);
    return true;
  }

  @Mutation(() => Boolean)
  @Role(['Owner'])
  async markOrderAsReadyByOwner(
    @AuthUser() userInfo: UserInfoProjection,
    @Args('input') { id: orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.ownerOrderService.markReady(orderId, userInfo);
    return true;
  }
}

@Resolver()
export class DriverOrderResolver {
  constructor(private readonly driverOrderService: DriverOrderService) {}

  @Query(() => [GqlDriverOrderDTO])
  @Role(['Driver'])
  async getOrdersForDriver(
    @AuthUser() userInfo: UserInfoProjection,
  ): Promise<GqlDriverOrderDTO[]> {
    const orders = await this.driverOrderService.getOrders(userInfo);
    return orders.map((order) => new GqlDriverOrderDTO(order));
  }

  @Query(() => GqlDriverOrderDTO)
  @Role(['Driver'])
  async getOrderForDriver(
    @AuthUser() userInfo: UserInfoProjection,
    @Args('input') { orderId }: GetOrderInput,
  ): Promise<GqlDriverOrderDTO> {
    const order = await this.driverOrderService.getOrder(userInfo, orderId);
    return new GqlDriverOrderDTO(order);
  }

  @Query(() => [GqlDriverOrderDTO])
  @Role(['Driver'])
  async getOrderHistoryForDriver(
    @AuthUser() userInfo: UserInfoProjection,
  ): Promise<GqlDriverOrderDTO[]> {
    const orders = await this.driverOrderService.getOrderHistory(userInfo);
    return orders.map((order) => new GqlDriverOrderDTO(order));
  }

  // used
  @Mutation(() => Boolean)
  @Role(['Driver'])
  async acceptOrderByDriver(
    @AuthUser() userInfo: UserInfoProjection,
    @Args('input') { id: orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.driverOrderService.accept(orderId, userInfo);
    return true;
  }

  // used
  @Mutation(() => Boolean)
  @Role(['Driver'])
  async rejectOrderByDriver(
    @AuthUser() userInfo: UserInfoProjection,
    @Args('input') { id: orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.driverOrderService.reject(orderId, userInfo);
    return true;
  }

  // used
  @Mutation(() => Boolean)
  @Role(['Driver'])
  async pickUpOrderByDriver(
    @AuthUser() userInfo: UserInfoProjection,
    @Args('input') { id: orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.driverOrderService.pickup(orderId, userInfo);
    return true;
  }

  // used
  @Mutation(() => Boolean)
  @Role(['Driver'])
  async completeDelivery(
    @AuthUser() userInfo: UserInfoProjection,
    @Args('input') { id: orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.driverOrderService.completeDelivery(orderId, userInfo);
    return true;
  }
}
