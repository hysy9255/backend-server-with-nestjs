import { User } from 'src/user/domain/user.entity';
import { Restaurant } from '../domain/restaurant.entity';
import { RestaurantRepository } from './restaurant-repository.interface';

export class MemoryRestaurantRepository implements RestaurantRepository {
  private restaurants: Restaurant[] = [];

  async save(user: User, restaurant: Restaurant): Promise<Restaurant> {
    restaurant.owner = user;
    this.restaurants.push(restaurant);
    return restaurant;
  }

  async findOneById(id: string): Promise<Restaurant | null> {
    const restaurant = this.restaurants.find(
      (restaurant) => restaurant.id === id,
    );
    return restaurant || null;
  }

  async find(): Promise<Restaurant[]> {
    return this.restaurants;
  }

  async findByOwner(user: User): Promise<Restaurant | null> {
    const restaurant = this.restaurants.find(
      (restaurant) => restaurant.owner.id === user.id,
    );
    return restaurant || null;
  }

  show() {
    console.log(this.restaurants);
  }

  clear() {
    this.restaurants = []; // 저장된 유저 리스트를 비워줌
  }
}
