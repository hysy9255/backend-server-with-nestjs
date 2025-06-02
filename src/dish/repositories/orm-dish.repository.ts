import { Injectable, NotFoundException } from '@nestjs/common';
import { DishRepository } from './dish-repository.interface';
import { EntityManager } from 'typeorm';

import { Dish } from '../domain/dish.entity';
import { RestaurantRecord } from 'src/restaurant/orm-records/restaurant.record';

@Injectable()
export class OrmDishRepository implements DishRepository {
  constructor(private readonly em: EntityManager) {}

  async save(restaurant: RestaurantRecord, dish: Dish): Promise<Dish> {
    dish.restaurant = restaurant;
    return this.em.save(dish);
  }

  async findOneById(id: string): Promise<Dish | null> {
    return this.em.findOne(Dish, { where: { id } });
  }

  async findByRestaurantId(restaurantId: string): Promise<Dish[] | null> {
    return this.em.find(Dish, { where: { restaurant: { id: restaurantId } } });
  }

  async deleteOneById(id: string): Promise<Dish> {
    const dish = await this.findOneById(id);
    if (!dish) {
      throw new NotFoundException(`Dish with id ${id} not found`);
    }
    await this.em.remove(dish);
    return dish;
  }
}
