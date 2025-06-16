import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import {
  IRestaurantQueryRepository,
  RestaurantQueryProjection,
} from 'src/restaurant/infrastructure/repositories/query/retaurant-query.repository.interface';

@Injectable()
export class RestaurantQueryRepository implements IRestaurantQueryRepository {
  constructor(private readonly em: EntityManager) {}

  // used
  async findSummary(restaurantId: string): Promise<RestaurantQueryProjection> {
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

    return result;
  }

  // used
  async findSummaries(): Promise<RestaurantQueryProjection[]> {
    const result = await this.em
      .createQueryBuilder()
      .select([
        'restaurant.id AS id',
        'restaurant.name AS name',
        'restaurant.address AS address',
        'restaurant.category AS category',
      ])
      .from('restaurant', 'restaurant')
      .getRawMany();

    return result;
  }
}
