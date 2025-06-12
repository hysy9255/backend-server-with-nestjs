import { RestaurantOrmEntity } from 'src/restaurant/infrastructure/orm-entities/restaurant.orm.entity';
import { RestaurantProjection } from '../projections/restaurant.projection';

export interface IRestaurantCommandRepository {
  save(restaurant: RestaurantOrmEntity): Promise<void>;
  findOneById(id: string): Promise<RestaurantProjection | null>;
}
