import { RestaurantRecord } from '../orm-entities/restaurant.orm.entity';

export interface RestaurantRepository {
  save(
    // user: UserRecord,
    restaurant: RestaurantRecord,
  ): Promise<RestaurantRecord>;
  findOneById(id: string): Promise<RestaurantRecord | null>;
  find(): Promise<RestaurantRecord[]>;
  // findOneByOwner(user: UserRecord): Promise<RestaurantRecord | null>;
}
