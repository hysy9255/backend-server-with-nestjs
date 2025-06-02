import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { OrderRepository } from './order-repository.interface';

import { OrderStatus } from 'src/constants/orderStatus';

import { Brackets } from 'typeorm';
import { OrderRecord } from '../orm-records/order.record';
import { UserRecord } from 'src/user/orm-records/user.record';
import { DriverRecord } from 'src/user/orm-records/driver.record';

@Injectable()
export class OrmOrderRepository implements OrderRepository {
  constructor(private readonly em: EntityManager) {}

  async save(order: OrderRecord): Promise<OrderRecord> {
    return this.em.save(order);
  }

  async findOneById(id: string): Promise<OrderRecord | null> {
    return this.em.findOne(OrderRecord, {
      where: { id },
      relations: ['driver', 'restaurant', 'customer'],
    });
  }

  async findOneWithFullRelationById(id: string): Promise<OrderRecord | null> {
    return this.em.findOne(OrderRecord, {
      where: { id },
      relations: ['driver', 'restaurant', 'customer', 'rejectedByDrivers'],
    });
  }

  async findHistoryByUserId(userId: string): Promise<OrderRecord[]> {
    return this.em.find(OrderRecord, {
      where: { customer: { id: userId }, status: OrderStatus.Delivered },
    });
  }

  async findByRestaurant(restaurantId: string): Promise<OrderRecord[]> {
    return this.em.find(OrderRecord, {
      where: { restaurant: { id: restaurantId } },
    });
  }

  async findAvailableOrdersForDriver(
    driver: DriverRecord,
  ): Promise<OrderRecord[]> {
    return this.em
      .getRepository(OrderRecord)
      .createQueryBuilder('order')
      .leftJoin('order.rejectedByDrivers', 'rejected')
      .where('order.status IN (:...statuses)', {
        statuses: [OrderStatus.Accepted, OrderStatus.Ready],
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where('rejected.id IS NULL').orWhere('rejected.id != :driverId', {
            driverId: driver.id,
          });
        }),
      )
      .getMany();
  }
}
