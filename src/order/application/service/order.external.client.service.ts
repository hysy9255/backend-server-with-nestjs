import { Inject, Injectable } from '@nestjs/common';
import { OrderEntity } from '../../domain/order.entity';
import { IOrderCommandRepository } from '../../infrastructure/repositories/command/order-command.repository.interface';
import { IOrderQueryRepository } from '../../infrastructure/repositories/query/order-query.repository.interface';
import { CreateOrderInput } from 'src/order/interface/dtos/inputs/order-inputs.dto';
import { UserQueryProjection } from 'src/user/infrastructure/repositories/query/user/user-query.repository.interface';
import { UserAuthService } from 'src/user/application/service/user.auth.service';
import { OrderEventPublisher } from '../order.event.publisher';
import { RestaurantInternalService } from 'src/restaurant/application/service/restaurant.internal.service';
import { OrderForClient } from 'src/order/infrastructure/repositories/query/projections/order.projection';
import { OrderMapper } from '../order.mapper';
import { UserInfoProjection } from 'src/user/infrastructure/repositories/query/user.info.projection';

@Injectable()
export class ClientOrderService {
  constructor(
    @Inject('IOrderCommandRepository')
    private readonly orderCmdRepo: IOrderCommandRepository,
    @Inject('IOrderQueryRepository')
    private readonly orderQryRepo: IOrderQueryRepository,

    private readonly restaurantInternalService: RestaurantInternalService,
    private readonly userAuthService: UserAuthService,
    private readonly orderEventPublisher: OrderEventPublisher,
  ) {}

  // prettier-ignore
  async createOrder(
    userInfo: UserInfoProjection,
    { restaurantId }: CreateOrderInput,
  ): Promise<void> {
    const client = await this.userAuthService._getClient(userInfo.userId);
    await this.restaurantInternalService._validateRestaurantExistsOrThrow(restaurantId);
    const order = OrderEntity.createNew(restaurantId, client.id);
    await this.orderCmdRepo.save(OrderMapper.toOrmEntity(order));
    await this.orderEventPublisher.broadcastNewOrder(order.id);
  }

  async getOrder(
    userInfo: UserInfoProjection,
    orderId: string,
  ): Promise<OrderForClient> {
    const client = await this.userAuthService._getClient(userInfo.userId);
    const order = await this.orderQryRepo.findOneForClient(orderId);
    client.ensureOwnsOrderOf(order);
    return order;
  }

  async getHistory(
    userInfo: UserInfoProjection,
  ): Promise<Partial<OrderForClient>[]> {
    const client = await this.userAuthService._getClient(userInfo.userId);
    return await this.orderQryRepo.findDeliveredForClient(client.id);
  }

  async getOnGoing(
    userInfo: UserInfoProjection,
  ): Promise<OrderForClient | null> {
    const client = await this.userAuthService._getClient(userInfo.userId);
    return await this.orderQryRepo.findOnGoingForClient(client.id);
  }
}
