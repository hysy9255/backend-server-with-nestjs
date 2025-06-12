import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { RestaurantProjection } from 'src/restaurant/application/command/projections/restaurant.projection';
import { IRestaurantCommandRepository } from 'src/restaurant/application/command/repositories/restaurant-command.repository.interface';
import { RestaurantOrmEntity } from '../../orm-entities/restaurant.orm.entity';

@Injectable()
export class RestaurantCommandRepository
  implements IRestaurantCommandRepository
{
  constructor(private readonly em: EntityManager) {}

  // used
  async save(restaurant: RestaurantOrmEntity): Promise<void> {
    this.em.save(restaurant);
  }
  // used
  async findOneById(
    restaurantId: string,
  ): Promise<RestaurantProjection | null> {
    const result = await this.em
      .createQueryBuilder()
      .select([
        'restaurant.id. AS id',
        'restaurant.name AS name',
        'restaurant.address AS address',
        'restaurant.category AS category',
        'restaurant.ownerId AS "ownerId"',
      ])
      .from('restaurant', 'restaurant')
      .where('restaurant.id = :id', { id: restaurantId })
      .getRawOne();
    return result;
  }
}
