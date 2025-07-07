import { RestaurantOrmEntity } from 'src/restaurant/infrastructure/orm-entities/restaurant.orm.entity';

export class RestaurantCommandProjection {
  id: string;
  name: string;
  address: string;
  category: string;
  ownerId: string;
}

export interface IRestaurantCommandRepository {
  save(restaurant: RestaurantOrmEntity): Promise<void>;
  findOneById(id: string): Promise<RestaurantCommandProjection | null>;
}
