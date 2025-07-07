import { Restaurant } from './projections/restaurant.projection';

export interface IRestaurantQueryRepository {
  findOneById(restaurantId: string);
  findOne(restaurantId: string): Promise<Restaurant | null>;
  findMany(): Promise<Restaurant[]>;
}
