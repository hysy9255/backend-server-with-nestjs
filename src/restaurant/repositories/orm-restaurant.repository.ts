import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { RestaurantRepository } from './restaurant-repository.interface';
import { RestaurantRecord } from '../orm-entities/restaurant.orm.entity';

@Injectable()
export class OrmRestaurantRepository implements RestaurantRepository {
  constructor(private readonly em: EntityManager) {}

  async save(
    // user: UserRecord,
    restaurant: RestaurantRecord,
  ): Promise<RestaurantRecord> {
    // restaurant.owner = user;
    return this.em.save(restaurant);
  }

  async findOneById(id: string): Promise<RestaurantRecord | null> {
    return this.em.findOne(RestaurantRecord, { where: { id } });
  }

  async find(): Promise<RestaurantRecord[]> {
    return this.em.find(RestaurantRecord);
  }

  // async findOneByOwner(user: UserRecord): Promise<RestaurantRecord | null> {
  //   return this.em.findOne(RestaurantRecord, { where: { owner: user } });
  // }
}
