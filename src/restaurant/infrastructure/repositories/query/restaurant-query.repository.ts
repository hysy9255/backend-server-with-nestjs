import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { IRestaurantQueryRepository } from 'src/restaurant/application/query/repositories/retaurant-query.repository.interface';
import { RestaurantSummaryProjection } from 'src/restaurant/application/query/projections/restaurant.projection';

@Injectable()
export class RestaurantQueryRepository implements IRestaurantQueryRepository {
  constructor(private readonly em: EntityManager) {}

  // used
  async findSummary(
    restaurantId: string,
  ): Promise<RestaurantSummaryProjection> {
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
  async findSummaries(): Promise<RestaurantSummaryProjection[]> {
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
