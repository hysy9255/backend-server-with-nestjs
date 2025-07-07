import { RestaurantOrmEntity } from 'src/restaurant/infrastructure/orm-entities/restaurant.orm.entity';
import { Dish } from '../domain/dish.entity';

export interface DishRepository {
  save(restaurant: RestaurantOrmEntity, dish: Dish): Promise<Dish>;
  findOneById(id: string): Promise<Dish | null>;
  findByRestaurantId(restaurantId: string): Promise<Dish[] | null>;
  deleteOneById(id: string): Promise<Dish | null>;
}
