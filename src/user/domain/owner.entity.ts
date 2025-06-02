import { OrderEntity } from 'src/order/domain/order.entity';
import { RestaurantEntity } from 'src/restaurant/domain/restaurant.entity';
import { RestaurantMapper } from 'src/restaurant/mapper/restaurant.mapper';
import { RestaurantRecord } from 'src/restaurant/orm-records/restaurant.record';
import { v4 as uuidv4 } from 'uuid';

export class OwnerEntity {
  private _restaurant?: RestaurantEntity;

  constructor(private readonly _id: string) {}

  static createNew() {
    return new OwnerEntity(uuidv4());
  }

  static fromPersistance(
    id: string,
    restaurant?: RestaurantEntity,
  ): OwnerEntity {
    const owner = new OwnerEntity(id);

    if (restaurant) {
      owner._restaurant = restaurant;
    }

    return owner;
  }

  ownsRestaurantOf(restaurantId: string) {
    return restaurantId === this._restaurant?.id;
  }

  canAccessOrderOf(order: OrderEntity) {
    return order.restaurant.id === this._restaurant?.id;
  }

  hasRestaurant() {
    return !!this._restaurant;
  }

  assignRestaurant(restaurant: RestaurantEntity) {
    this._restaurant = restaurant;
  }

  get id() {
    return this._id;
  }

  get restaurant() {
    return this._restaurant;
  }
}
