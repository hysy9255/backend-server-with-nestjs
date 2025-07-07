import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { IRestaurantQueryRepository } from 'src/restaurant/infrastructure/repositories/query/retaurant-query.repository.interface';
import { Restaurant } from './projections/restaurant.projection';

@Injectable()
export class RestaurantQueryRepository implements IRestaurantQueryRepository {
  constructor(private readonly em: EntityManager) {}

  async findOneById(restaurantId: string) {
    const result = await this.em
      .createQueryBuilder()
      .select(['restaurant.id AS id', 'restaurant.ownerId AS "ownerId"'])
      .from('restaurant', 'restaurant')
      .where('restaurant.id = :id', { id: restaurantId })
      .getRawOne();

    return result ? result : null;
  }

  // used
  async findOne(restaurantId: string): Promise<Restaurant | null> {
    const result = await this.em
      .createQueryBuilder()
      .select([
        'restaurant.id AS id',
        'restaurant.name AS name',
        'restaurant.address AS address',
        'restaurant.category AS category',
      ])
      .from('restaurant', 'restaurant')
      .where('restaurant.id = :id', { id: restaurantId })
      .getRawOne();

    return result ? result : null;
  }

  // used
  async findMany(): Promise<Restaurant[]> {
    return await this.em
      .createQueryBuilder()
      .select([
        'restaurant.id AS id',
        'restaurant.name AS name',
        'restaurant.address AS address',
        'restaurant.category AS category',
      ])
      .from('restaurant', 'restaurant')
      .getRawMany();
  }
}
