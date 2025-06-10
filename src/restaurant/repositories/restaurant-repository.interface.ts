import { RestaurantOrmEntity } from '../orm-entities/restaurant.orm.entity';
import { RestaurantSummaryProjection } from '../projections/restaurantSummary.projection';

export interface RestaurantRepository {
  // used
  save(restaurant: RestaurantOrmEntity): Promise<void>;
  // used
  findOneById(id: string): Promise<RestaurantOrmEntity | null>;
  // used
  findSummary(restaurantId: string): Promise<RestaurantSummaryProjection>;
  // used
  findSummaries(): Promise<RestaurantSummaryProjection[]>;

  // find(): Promise<RestaurantOrmEntity[]>;
  // findOneByOwner(user: UserRecord): Promise<RestaurantOrmEntity | null>;
}
