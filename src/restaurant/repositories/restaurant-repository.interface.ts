import { User } from 'src/user/orm-records/user.record';
import { Restaurant } from '../orm-records/restaurant.record';

export interface RestaurantRepository {
  save(user: User, restaurant: Restaurant): Promise<Restaurant>;
  findOneById(id: string): Promise<Restaurant | null>;
  find(): Promise<Restaurant[]>;
  findOneByOwner(user: User): Promise<Restaurant | null>;
}
