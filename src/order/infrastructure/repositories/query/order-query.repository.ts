import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { IOrderQueryRepository } from './order-query.repository.interface';
import {
  OrderForClient,
  OrderForDriver,
  OrderForOwner,
} from './projections/order.projection';

@Injectable()
export class OrderQueryRepository implements IOrderQueryRepository {
  constructor(private readonly em: EntityManager) {}

  async findOneById(orderId: string) {
    const result = await this.em
      .createQueryBuilder()
      .select(['order.id AS id', 'order.restaurantId AS "restaurantId"'])
      .from('order', 'order')
      .where('order.id = :id', { id: orderId })
      .getRawOne();

    return result ? result : null;
  }

  async findOneForDriver(orderId: string): Promise<OrderForDriver> {
    const result = await this.em
      .createQueryBuilder()
      .select([
        'order.id AS id',
        'order.status AS status',
        'client.deliveryAddress AS "deliveryAddress"',
        'client.id AS "clientId"',
        'order.driverId AS "driverId"',
        'order.restaurantId AS "restaurantId"',
        'restaurant.name AS "restaurantName"',
      ])
      .from('order', 'order')
      .leftJoin('client', 'client', 'client.id = order.clientId')
      .leftJoin(
        'restaurant',
        'restaurant',
        'restaurant.id = order.restaurantId',
      )
      .where('order.id = :id', { id: orderId })
      .getRawOne();

    if (!result) throw new NotFoundException('Order Not Found');

    return result;
  }

  async findAvailableForDriver(driverId: string): Promise<OrderForDriver[]> {
    const result = await this.em
      .createQueryBuilder()
      .select([
        'order.id AS "id"',
        'order.status AS status',
        'client.deliveryAddress AS "deliveryAddress"',
        'order.clientId AS "clientId"',
        'order.restaurantId AS "restaurantId"',
        'restaurant.name AS "restaurantName"',
      ])
      .from('order', 'order')
      .leftJoin('client', 'client', 'client.id = order.clientId')
      .leftJoin(
        'restaurant',
        'restaurant',
        'restaurant.id = order.restaurantId',
      )
      .leftJoin(
        'order_driver_rejection',
        'odr',
        'odr.orderId = order.id AND odr.driverId = :driverId',
        { driverId },
      )
      .where('order.status IN (:...statuses)', {
        statuses: ['Ready', 'Accepted'],
      })
      .andWhere('odr.id IS NULL')
      .getRawMany();

    return result;
  }

  async findOneForOwner(id: string): Promise<OrderForOwner> {
    const result = await this.em
      .createQueryBuilder()
      .select([
        'order.id AS id',
        'order.status AS status',
        'client.deliveryAddress AS "deliveryAddress"',
        'order.clientId AS "clientId"',
        'order.driverId AS "driverId"',
        'order.restaurantId AS "restaurantId"',
        'restaurant.ownerId AS "ownerId"',
      ])
      .from('order', 'order')
      .leftJoin('client', 'client', 'client.id = order.clientId')
      .leftJoin(
        'restaurant',
        'restaurant',
        'restaurant.id = order.restaurantId',
      )
      .where('order.id = :id', { id })
      .getRawOne();

    if (!result) {
      throw new NotFoundException('Order Not Found');
    }

    return result;
  }

  async findManyForOwner(restaurantId: string): Promise<OrderForOwner[]> {
    const result = await this.em
      .createQueryBuilder()
      .select([
        'order.id AS id',
        'order.status AS status',
        'client.deliveryAddress AS "deliveryAddress"',
        'order.clientId AS "clientId"',
        'order.driverId AS "driverId"',
        'order.restaurantId AS "restaurantId"',
      ])
      .from('order', 'order')
      .leftJoin('client', 'client', 'client.id = order.clientId')
      .where('order.restaurantId = :restaurantId', { restaurantId })
      .getRawMany();

    return result;
  }

  async findOneForClient(orderId: string): Promise<OrderForClient> {
    const result = await this.em
      .createQueryBuilder()
      .select([
        'order.id AS id',
        'order.status AS status',
        'client.deliveryAddress AS "deliveryAddress"',
        'order.clientId AS "clientId"',
        'order.driverId AS "driverId"',
        'order.restaurantId AS "restaurantId"',
        'restaurant.name AS "restaurantName"',
      ])
      .from('order', 'order')
      .leftJoin('client', 'client', 'client.id = order.clientId')
      .leftJoin(
        'restaurant',
        'restaurant',
        'restaurant.id = order.restaurantId',
      )
      .where('order.id = :id', { id: orderId })
      .getRawOne();

    if (!result) throw new NotFoundException('Order Not Found');

    return result;
  }

  async findDeliveredForClient(
    clientId: string,
  ): Promise<Partial<OrderForClient>[]> {
    const result = await this.em
      .createQueryBuilder()
      .select([
        'order.id AS id',
        'order.status AS status',
        'order.restaurantId AS "restaurantId"',
        'restaurant.name AS "restaurantName"',
      ])
      .from('order', 'order')
      .leftJoin(
        'restaurant',
        'restaurant',
        'restaurant.id = order.restaurantId',
      )
      .where('order.clientId = :clientId AND order.status = :status', {
        clientId: clientId,
        status: 'Delivered',
      })
      .getRawMany();

    return result;
  }

  async findOnGoingForClient(clientId: string): Promise<OrderForClient | null> {
    const result = await this.em
      .createQueryBuilder()
      .select([
        'order.id AS id',
        'order.status AS status',
        'client.deliveryAddress AS "deliveryAddress"',
        'order.clientId AS "clientId"',
        'order.driverId AS "driverId"',
        'order.restaurantId AS "restaurantId"',
        'restaurant.name AS "restaurantName"',
      ])
      .from('order', 'order')
      .leftJoin('client', 'client', 'client.id = order.clientId')
      .leftJoin(
        'restaurant',
        'restaurant',
        'restaurant.id = order.restaurantId',
      )
      .where('order.clientId = :clientId', { clientId })
      .andWhere('order.status IN (:...statuses)', {
        statuses: ['Pending', 'Accepted', 'Ready', 'PickedUp'],
      })
      .getRawOne();

    return result;
  }
}
