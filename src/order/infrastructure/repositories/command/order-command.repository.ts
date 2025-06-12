import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { OrderOrmEntity } from 'src/order/infrastructure/orm-entities/order.orm.entity';
import { IOrderCommandRepository } from '../../../application/command/repositories/order-command.repository.interface';
import { OrderStatus } from 'src/constants/orderStatus';

export class OrderProjection {
  id: string;
  status: OrderStatus;
  customerId: string;
  driverId?: string | null;
  restaurantId: string;
  rejectedDriverIds: string[];
}

@Injectable()
export class OrderCommandRepository implements IOrderCommandRepository {
  constructor(private readonly em: EntityManager) {}

  async save(order: OrderOrmEntity): Promise<void> {
    this.em.save(order);
  }

  async findOneById(orderId: string): Promise<OrderProjection | null> {
    const result = this.em
      .createQueryBuilder()
      .select([
        'order.id AS id',
        'order.status AS status',
        'order.customerId AS "customerId"',
        'order.driverId AS "driverId"',
        'order.restaurantId AS "restaurantId"',
        'array_remove(array_agg(ord.driverId), NULL) AS "rejectedDriverIds"',
      ])
      .from('order', 'order')
      .leftJoin('order_driver_rejection', 'ord', 'ord.orderId = order.id')
      .where('order.id = :id', { id: orderId })
      .groupBy('order.id')
      .getRawOne();

    return result;
  }
}
