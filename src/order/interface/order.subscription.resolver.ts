import { Inject } from '@nestjs/common';
import { Resolver, Subscription } from '@nestjs/graphql';
import {
  GqlDriverOrderDTO,
  GqlOwnerOrderDTO,
} from './dtos/outputs/graphql/order-output.dtos';
import { OrderSubPayload } from '../application/order.event.publisher';
import { UserInfoProjection } from 'src/user/infrastructure/repositories/query/user.info.projection';
import { PubSub } from 'graphql-subscriptions';
import { UserRole } from 'src/constants/userRole';

@Resolver()
export class OrderSubscriptionResolver {
  constructor(@Inject('PUB_SUB') private readonly pubSub: PubSub) {}

  @Subscription((returns) => GqlOwnerOrderDTO, {
    filter: (
      payload: OrderSubPayload,
      _,
      context: { subscriberInfo: UserInfoProjection },
    ) => {
      return (
        context.subscriberInfo.role === UserRole.Owner &&
        context.subscriberInfo.ownerId === payload.order.ownerId
      );
    },
    resolve: (data: OrderSubPayload) => {
      return new GqlOwnerOrderDTO(data.order);
    },
  })
  newOrder() {
    return this.pubSub.asyncIterableIterator('NEW_ORDER');
  }

  @Subscription(() => GqlOwnerOrderDTO, {
    filter: (
      payload: OrderSubPayload,
      _,
      context: { subscriberInfo: UserInfoProjection },
    ) => {
      return (
        context.subscriberInfo.role === UserRole.Owner &&
        context.subscriberInfo.ownerId === payload.order.ownerId
      );
    },
    resolve: (data: OrderSubPayload) => {
      return new GqlOwnerOrderDTO(data.order);
    },
  })
  orderUpdateForOwner() {
    return this.pubSub.asyncIterableIterator('ORDER_UPDATE_FOR_OWNER');
  }

  @Subscription(() => GqlOwnerOrderDTO, {
    filter: (
      payload: OrderSubPayload,
      _,
      context: { subscriberInfo: UserInfoProjection },
    ) => {
      return (
        context.subscriberInfo.role === UserRole.Client &&
        context.subscriberInfo.clientId === payload.order.clientId
      );
    },
    resolve: (data: OrderSubPayload) => {
      return new GqlOwnerOrderDTO(data.order);
    },
  })
  orderUpdateForClient() {
    return this.pubSub.asyncIterableIterator('ORDER_UPDATE_FOR_CLIENT');
  }

  @Subscription(() => GqlDriverOrderDTO, {
    filter: (
      payload: OrderSubPayload,
      _,
      context: { subscriberInfo: UserInfoProjection },
    ) => {
      return (
        context.subscriberInfo.role === UserRole.Driver &&
        context.subscriberInfo.driverId === payload.order.driverId
      );
    },
    resolve: (data: OrderSubPayload) => {
      return new GqlDriverOrderDTO(data.order);
    },
  })
  orderUpdateForDriver() {
    return this.pubSub.asyncIterableIterator<OrderSubPayload>(
      'ORDER_UPDATE_FOR_DRIVER',
    );
  }
}
