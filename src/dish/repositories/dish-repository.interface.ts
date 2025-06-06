import { RestaurantRecord } from 'src/restaurant/orm-records/restaurant.record';
import { Dish } from '../domain/dish.entity';

export interface DishRepository {
  save(restaurant: RestaurantRecord, dish: Dish): Promise<Dish>;
  findOneById(id: string): Promise<Dish | null>;
  findByRestaurantId(restaurantId: string): Promise<Dish[] | null>;
  deleteOneById(id: string): Promise<Dish | null>;
}
