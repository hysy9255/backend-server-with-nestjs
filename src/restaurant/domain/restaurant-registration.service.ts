import { OwnerEntity } from 'src/user/domain/owner.entity';
import { RestaurantEntity } from './restaurant.entity';

export class RestaurantRegistrationService {
  static register(
    owner: OwnerEntity,
    name: string,
    address: string,
    category: string,
  ): RestaurantEntity {
    if (owner.hasRestaurant()) {
      throw new Error(
        "Owner already owns a restaurant! Can't register another one",
      );
    }
    const restaurant = RestaurantEntity.createNew(
      name,
      address,
      category,
      owner.id,
    );
    owner.assignRestaurant(restaurant.id);
    return restaurant;
  }
}
