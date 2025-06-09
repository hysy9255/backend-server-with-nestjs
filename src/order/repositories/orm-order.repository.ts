import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { OrderRepository } from './order-repository.interface';

import { OrderStatus } from 'src/constants/orderStatus';

import { Brackets } from 'typeorm';
import { OrderOrmEntity } from '../orm-entities/order.orm.entity';
import { OwnerOrderSummary } from '../projections/orderSummaryForOwner.projection';
import { OrderProjection } from '../projections/order.projection';
import { DeliveredOrderPreview } from '../projections/deliveredOrdersForCustomer.projection';
import { ClientOrderSummary } from '../projections/orderSummaryForClient.projection';

@Injectable()
export class OrmOrderRepository implements OrderRepository {
  constructor(private readonly em: EntityManager) {}

  async save(order: OrderOrmEntity): Promise<void> {
    this.em.save(order);
  }

  async findOneById(id: string): Promise<OrderOrmEntity | null> {
    return this.em.findOne(OrderOrmEntity, {
      where: { id },
    });
  }

  // async findOneById(id: string): Promise<OrderProjection | null> {
  //   const result = await this.em
  //     .createQueryBuilder()
  //     .select([
  //       'order.id AS id',
  //       'order.status AS status',
  //       'order.customerId AS customerId',
  //       'order.driverId AS driverId',
  //       'order.restaurantId AS restaurantId',
  //     ])
  //     .from('order', 'order')
  //     .where('order.id = :id', { id })
  //     .getRawOne();

  //   return result;
  // }

  async findSummaryForClient(id: string): Promise<ClientOrderSummary | null> {
    const result = await this.em
      .createQueryBuilder()
      .select([
        'order.id AS id',
        'order.status AS status',
        'customer.delivery_address AS deliveryAddress',
        'order.customerId AS customerId',
        'order.driverId AS driverId',
        'order.restaurantId AS restaurantId',
      ])
      .from('order', 'order')
      .leftJoin('customer', 'customer', 'customer.id = order.customerId')
      .where('order.id = :id', { id })
      .getRawOne();

    return result;
  }

  async findSummaryForOwner(id: string): Promise<OwnerOrderSummary | null> {
    const result = await this.em
      .createQueryBuilder()
      .select([
        'order.id AS id',
        'order.status AS status',
        'customer.delivery_address AS deliveryAddress',
        'order.customerId AS customerId',
        'order.driverId AS driverId',
        'order.restaurantId AS restaurantId',
      ])
      .from('order', 'order')
      .leftJoin('customer', 'customer', 'customer.id = order.customerId')
      .where('order.id = :id', { id })
      .getRawOne();

    return result;
  }

  async findOrderSummariesByRestaurant(
    restaurantId: string,
  ): Promise<OwnerOrderSummary[]> {
    const result = await this.em
      .createQueryBuilder()
      .select([
        'order.id AS id',
        'order.customerId AS customerId',
        'order.driverId AS driverId',
        'order.status AS status',
        'customer.delivery_address AS deliveryAddress',
      ])
      .from('order', 'order')
      .leftJoin('customer', 'customer', 'customer.id = order.customerId')
      .where('order.restaurantId = :restaurantId', { restaurantId })
      .getRawMany();

    return result;
  }

  async findDeliveredByCustomer(
    customerId: string,
  ): Promise<DeliveredOrderPreview[]> {
    const result = await this.em
      .createQueryBuilder()
      .select([
        'order.id AS id',
        'order.status AS status',
        'order.restaurantId AS restaurantId',
      ])
      .from('order', 'order')
      .where('order.customerId = :customerId', { customerId })
      .getRawMany();

    return result;
  }

  // async findDeliveredOrdersByCustomerId(
  //   customerId: string,
  // ): Promise<OrderRecord[]> {
  //   return this.em.find(OrderRecord, {
  //     where: { customerId, status: OrderStatus.Delivered },
  //   });
  // }

  // async findByRestaurantId(restaurantId: string): Promise<OrderRecord[]> {
  //   return this.em.find(OrderRecord, {
  //     where: { restaurantId },
  //   });
  // }

  // async findWithCustomerInfoByRestaurantId(
  //   restaurantId: string,
  // ): Promise<OrderRecord[]> {
  //   return this.em.find(OrderRecord, {
  //     where: { restaurantId },
  //     relations: ['customer'],
  //   });
  // }

  // async findOneWithCustomerInfoById(id: string): Promise<OrderRecord | null> {
  //   return this.em.findOne(OrderRecord, {
  //     where: { id },
  //     relations: ['customer'],
  //   });
  // }

  // async findAvailableOrdersForDriver2(
  //   driverId: string,
  // ): Promise<OrderRecord[]> {
  //   return (
  //     this.em
  //       .getRepository(OrderRecord)
  //       .createQueryBuilder('order')
  //       .leftJoinAndSelect('order.rejectedDrivers', 'rejected') // 여기서 함께 불러옴
  //       // .select(['order.id', 'order.status', 'order.restaurantId'])
  //       // .leftJoin('order.rejectedDrivers', 'rejected')
  //       // .where('order.status IN (:...statuses)', {
  //       //   statuses: [OrderStatus.Accepted, OrderStatus.Ready],
  //       // })
  //       // .andWhere(
  //       //   new Brackets((qb) => {
  //       //     qb.where('rejected.id IS NULL').orWhere('rejected.id != :driverId', {
  //       //       driverId: driver.id,
  //       //     });
  //       //   }),
  //       // )
  //       .getMany()
  //   );
  // }

  // async findAvailableOrdersForDriver(driverId: string): Promise<OrderRecord[]> {
  //   return this.em
  //     .getRepository(OrderRecord)
  //     .createQueryBuilder('order')
  //     .leftJoin('order.rejectedDrivers', 'rejected')
  //     .leftJoin('order.customer', 'customer')
  //     .select([
  //       'order.id AS "id"',
  //       'order.restaurantId AS "restaurantId"',
  //       'order.customerId AS "customerId"',
  //       'order.status AS "status"',
  //       'customer.deliveryAddress AS "deliveryAddress"',
  //     ])
  //     .where('order.status IN (:...statuses)', {
  //       statuses: ['Ready', 'Accepted'],
  //     })
  //     .andWhere(
  //       new Brackets((qb) => {
  //         qb.where('rejected.id IS NULL').orWhere('rejected.id != :driverId', {
  //           driverId,
  //         });
  //       }),
  //     )
  //     .getRawMany();
  // }
}
