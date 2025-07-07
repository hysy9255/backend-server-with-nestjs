import { OwnerEntity } from 'src/user/domain/owner.entity';
import { RestaurantEntity } from './restaurant.entity';
import { CreateRestaurantInput } from '../interface/dtos/restaurant-inputs.dto';

export class RestaurantRegistrationService {
  static register(
    owner: OwnerEntity,
    { name, address, category }: CreateRestaurantInput,
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
