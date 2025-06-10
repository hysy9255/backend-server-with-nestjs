import { OrderEntity } from 'src/order/domain/order.entity';
import { v4 as uuidv4 } from 'uuid';

export class OwnerEntity {
  // private _restaurant?: RestaurantEntity;
  private _restaurantId?: string;

  constructor(
    private readonly _id: string,
    private readonly _userId: string,
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
    const owner = new OwnerEntity(id, userId);

    if (restaurantId) {
      owner._restaurantId = restaurantId;
    }

    return owner;
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

// import { OrderEntity } from 'src/order/domain/order.entity';
// import { RestaurantEntity } from 'src/restaurant/domain/restaurant.entity';
// import { RestaurantMapper } from 'src/restaurant/mapper/restaurant.mapper';
// import { RestaurantRecord } from 'src/restaurant/orm-records/restaurant.record';
// import { v4 as uuidv4 } from 'uuid';

// export class OwnerEntity {
//   // private _restaurant?: RestaurantEntity;
//   private _restaurantId?: string;

//   constructor(
//     private readonly _id: string,
//     private readonly _userId: string,
//   ) {}

//   static createNew(userId: string) {
//     return new OwnerEntity(uuidv4(), userId);
//   }

//   static fromPersistance(
//     id: string,
//     userId: string,
//     restaurantId?: string,
//     // restaurant?: RestaurantEntity,
//   ): OwnerEntity {
//     const owner = new OwnerEntity(id, userId);

//     if (restaurant) {
//       owner._restaurant = restaurant;
//     }

//     return owner;
//   }

//   ownsRestaurantOf(restaurantId: string) {
//     return restaurantId === this._restaurant?.id;
//   }

//   canAccessOrderOf(order: OrderEntity) {
//     return order.restaurant.id === this._restaurant?.id;
//   }

//   hasRestaurant() {
//     return !!this._restaurant;
//   }

//   assignRestaurant(restaurant: RestaurantEntity) {
//     this._restaurant = restaurant;
//   }

//   get id() {
//     return this._id;
//   }

//   get userId() {
//     return this._userId;
//   }

//   get restaurant() {
//     return this._restaurant;
//   }
// }
