import { RestaurantOrmEntity } from 'src/restaurant/orm-entities/restaurant.orm.entity';
import { Dish } from '../domain/dish.entity';
import { DishRepository } from './dish-repository.interface';

export class MemoryDishRepository implements DishRepository {
  private dishes: Dish[] = [];

  async save(restaurant: RestaurantOrmEntity, dish: Dish): Promise<Dish> {
    dish.restaurant = restaurant;
    this.dishes.push(dish);
    return dish;
  }

  async findOneById(id: string): Promise<Dish | null> {
    const dish = this.dishes.find((dish) => dish.id === id);
    return dish || null;
  }

  async findByRestaurantId(restaurantId: string): Promise<Dish[] | null> {
    const dishes = this.dishes.filter(
      (dish) => dish.restaurant.id === restaurantId,
    );
    return dishes.length > 0 ? dishes : null;
  }

  async deleteOneById(id: string): Promise<Dish | null> {
    const dishIndex = this.dishes.findIndex((dish) => dish.id === id);
    if (dishIndex === -1) {
      return null;
    }
    const [deletedDish] = this.dishes.splice(dishIndex, 1);
    return deletedDish;
  }

  clear() {
    this.dishes = [];
  }
}
