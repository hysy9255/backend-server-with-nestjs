import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { OrderRepository } from './order-repository.interface';
import { Order } from '../orm-records/order.record';
import { OrderStatus } from 'src/constants/orderStatus';
import { In } from 'typeorm';
import { User } from 'src/user/orm-records/user.record';
import { Brackets } from 'typeorm';

@Injectable()
export class OrmOrderRepository implements OrderRepository {
  constructor(private readonly em: EntityManager) {}

  async save(order: Order): Promise<Order> {
    return this.em.save(order);
  }

  async findOneById(id: string): Promise<Order | null> {
    return this.em.findOne(Order, {
      where: { id },
      relations: ['driver', 'restaurant', 'customer'],
    });
  }

  async findOneWithFullRelationById(id: string): Promise<Order | null> {
    return this.em.findOne(Order, {
      where: { id },
      relations: ['driver', 'restaurant', 'customer', 'rejectedByDrivers'],
    });
  }

  async findHistoryByUserId(userId: string): Promise<Order[]> {
    return this.em.find(Order, {
      where: { customer: { id: userId }, status: OrderStatus.Delivered },
    });
  }

  async findByRestaurant(restaurantId: string): Promise<Order[]> {
    return this.em.find(Order, {
      where: { restaurant: { id: restaurantId } },
    });
  }

  async findAvailableOrdersForDriver(driver: User): Promise<Order[]> {
    return this.em
      .getRepository(Order)
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

  //   async findByStatus(input: OrderStatus[], driver: User): Promise<Order[]> {
  //     return this.em.find(Order, {
  //       where: { status: In(input) },
  //     });
  //   }

  //   async find(): Promise<Restaurant[]> {
  //     return this.em.find(Restaurant);
  //   }

  //   async findOneByOwner(user: User): Promise<Restaurant | null> {
  //     return this.em.findOne(Restaurant, { where: { owner: user } });
  //   }
}
