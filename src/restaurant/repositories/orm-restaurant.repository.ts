import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Restaurant } from '../domain/restaurant.entity';
import { User } from 'src/user/domain/user.entity';
import { RestaurantRepository } from './restaurant-repository.interface';

@Injectable()
export class OrmRestaurantRepository implements RestaurantRepository {
  constructor(private readonly em: EntityManager) {}

  async save(user: User, restaurant: Restaurant): Promise<Restaurant> {
    restaurant.owner = user;
    return this.em.save(restaurant);
  }

  async findOneById(id: string): Promise<Restaurant | null> {
    return this.em.findOne(Restaurant, { where: { id } });
  }

  async find(): Promise<Restaurant[]> {
    return this.em.find(Restaurant);
  }

  async findByOwner(user: User): Promise<Restaurant | null> {
    return this.em.findOne(Restaurant, { where: { owner: user } });
  }
}
