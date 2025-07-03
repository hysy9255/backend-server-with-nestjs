import { Inject, Injectable } from '@nestjs/common';
import { IOrderQueryRepository } from '../infrastructure/repositories/query/order-query.repository.interface';
import { PubSub } from 'graphql-subscriptions';

export type OrderSubPayload = {
  event: string;
  order: any;
};

@Injectable()
export class OrderEventPublisher {
  constructor(
    @Inject('IOrderQueryRepository')
    private readonly orderQryRepo: IOrderQueryRepository,
    @Inject('PUB_SUB')
    private readonly pubSub: PubSub,
  ) {}

  async broadcastNewOrder(orderId: string) {
    await this.pubSub.publish('NEW_ORDER', {
      event: 'order_created',
      order: await this.orderQryRepo.findOneForOwner(orderId),
    } as OrderSubPayload);
  }

  async broadcastOrderStatusUpdate(orderId: string) {
    await this.pubSub.publish('ORDER_UPDATE_FOR_OWNER', {
      event: 'order_status_update',
      order: await this.orderQryRepo.findOneForOwner(orderId),
    } as OrderSubPayload);

    await this.pubSub.publish('ORDER_UPDATE_FOR_DRIVER', {
      event: 'order_status_update',
      order: await this.orderQryRepo.findOneForDriver(orderId),
    } as OrderSubPayload);

    await this.pubSub.publish('ORDER_UPDATE_FOR_CLIENT', {
      event: 'order_status_update',
      order: await this.orderQryRepo.findOneForClient(orderId),
    } as OrderSubPayload);
  }
}
