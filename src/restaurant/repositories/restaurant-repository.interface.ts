import { UserRecord } from 'src/user/orm-records/user.record';
import { RestaurantRecord } from '../orm-records/restaurant.record';

export interface RestaurantRepository {
  save(
    user: UserRecord,
    restaurant: RestaurantRecord,
  ): Promise<RestaurantRecord>;
  findOneById(id: string): Promise<RestaurantRecord | null>;
  find(): Promise<RestaurantRecord[]>;
  findOneByOwner(user: UserRecord): Promise<RestaurantRecord | null>;
}
