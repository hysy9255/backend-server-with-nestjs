import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { OrderOrmEntity } from 'src/order/infrastructure/orm-entities/order.orm.entity';
import { IOrderCommandRepository } from './order-command.repository.interface';
import { OrderStatus } from 'src/constants/orderStatus';

export class OrderRecord {
  id: string;
  status: OrderStatus;
  restaurantId: string;
  clientId: string;
  driverId?: string | null;
  rejectedDriverIds?: string[];
}

@Injectable()
export class OrderCommandRepository implements IOrderCommandRepository {
  constructor(private readonly em: EntityManager) {}

  async save(order: OrderOrmEntity): Promise<void> {
    await this.em.save(order);
  }

  async findOneById(orderId: string): Promise<OrderRecord> {
    const result = await this.em
      .createQueryBuilder()
      .select([
        'order.id AS id',
        'order.status AS status',
        'order.clientId AS "clientId"',
        'order.driverId AS "driverId"',
        'order.restaurantId AS "restaurantId"',
        'array_remove(array_agg(ord.driverId), NULL) AS "rejectedDriverIds"',
      ])
      .from('order', 'order')
      .leftJoin('order_driver_rejection', 'ord', 'ord.orderId = order.id')
      .where('order.id = :id', { id: orderId })
      .groupBy('order.id')
      .getRawOne();

    if (!result) {
      throw new NotFoundException('Order Not Found');
    }
    console.log('from repository', result);
    return result;
  }
}
