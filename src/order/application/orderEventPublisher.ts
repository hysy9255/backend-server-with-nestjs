import { Inject, Injectable } from '@nestjs/common';
import { IOrderQueryRepository } from '../infrastructure/repositories/query/order-query.repository.interface';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class OrderEventPublisher {
  constructor(
    @Inject('IOrderQueryRepository')
    private readonly orderQryRepo: IOrderQueryRepository,
    @Inject('PUB_SUB')
    private readonly pubSub: PubSub,
  ) {}

  async broadcastNewOrder(orderId: string) {
    const orderSummary =
      await this.orderQryRepo.findOrderSummaryForOwner(orderId);

    if (orderSummary) {
      //   console.log('Broadcasting new order:', orderSummary);
      await this.pubSub.publish('NEW_ORDER', {
        method: 'order_created',
        ownerOrderSummaryProjection: orderSummary,
      });
    }
  }
}
