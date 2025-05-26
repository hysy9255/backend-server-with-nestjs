import { Restaurant } from 'src/restaurant/domain/restaurant.entity';
import { Dish } from '../domain/dish.entity';

export interface DishRepository {
  save(restaurant: Restaurant, dish: Dish): Promise<Dish>;
  findOneById(id: string): Promise<Dish | null>;
  findByRestaurantId(restaurantId: string): Promise<Dish[] | null>;
  deleteOneById(id: string): Promise<Dish | null>;
}
