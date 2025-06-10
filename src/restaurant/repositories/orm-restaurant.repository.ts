import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { RestaurantRepository } from './restaurant-repository.interface';
import { RestaurantOrmEntity } from '../orm-entities/restaurant.orm.entity';
import { RestaurantSummaryProjection } from '../projections/restaurantSummary.projection';

@Injectable()
export class OrmRestaurantRepository implements RestaurantRepository {
  constructor(private readonly em: EntityManager) {}

  // used
  async save(restaurant: RestaurantOrmEntity): Promise<void> {
    this.em.save(restaurant);
  }
  // used
  async findOneById(id: string): Promise<RestaurantOrmEntity | null> {
    return this.em.findOne(RestaurantOrmEntity, { where: { id } });
  }

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

  // async find(): Promise<RestaurantOrmEntity[]> {
  //   return this.em.find(RestaurantOrmEntity);
  // }

  // async findOneByOwner(user: UserRecord): Promise<RestaurantOrmEntity | null> {
  //   return this.em.findOne(RestaurantOrmEntity, { where: { owner: user } });
  // }
}
