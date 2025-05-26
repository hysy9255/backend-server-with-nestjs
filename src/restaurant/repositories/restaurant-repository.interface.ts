import { User } from 'src/user/domain/user.entity';
import { Restaurant } from '../domain/restaurant.entity';

export interface RestaurantRepository {
  save(user: User, restaurant: Restaurant): Promise<Restaurant>;
  findOneById(id: string): Promise<Restaurant | null>;
  find(): Promise<Restaurant[]>;
  findOneByOwner(user: User): Promise<Restaurant | null>;
}
