import { OrderEntity } from 'src/order/domain/order.entity';
import { v4 as uuidv4 } from 'uuid';

export class OwnerEntity {
  constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private _restaurantId?: string,
  ) {}

  // used
  static createNew(userId: string) {
    return new OwnerEntity(uuidv4(), userId);
  }

  // used
  static fromPersistance(
    id: string,
    userId: string,
    restaurantId?: string,
  ): OwnerEntity {
    return new OwnerEntity(id, userId, restaurantId);
  }

  // used
  ownsRestaurantOf(restaurantId: string) {
    return restaurantId === this._restaurantId;
  }

  // used
  canAccessOrderOf(order: OrderEntity) {
    return order.restaurantId === this._restaurantId;
  }

  // used
  hasRestaurant() {
    return !!this._restaurantId;
  }

  // used
  assignRestaurant(restaurantId: string) {
    this._restaurantId = restaurantId;
  }

  get id() {
    return this._id;
  }

  get userId() {
    return this._userId;
  }

  get restaurantId() {
    return this._restaurantId;
  }
}
