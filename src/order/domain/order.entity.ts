import { UnauthorizedException } from '@nestjs/common';
import { OrderStatus } from 'src/constants/orderStatus';
import { RestaurantEntity } from 'src/restaurant/domain/restaurant.entity';
import { CustomerEntity } from 'src/user/domain/customer.entity';
import { DriverEntity } from 'src/user/domain/driver.entity';
import { v4 as uuidv4 } from 'uuid';

export class OrderEntity {
  private _driver: DriverEntity;
  private _rejectedDrivers: DriverEntity[];

  constructor(
    private readonly _id: string,
    private _status: OrderStatus,
    private readonly _restaurant: RestaurantEntity,
    private readonly _customer: CustomerEntity,
  ) {
    this._rejectedDrivers = [];
  }

  static createNew(
    restaurant: RestaurantEntity,
    customer: CustomerEntity,
  ): OrderEntity {
    return new OrderEntity(uuidv4(), OrderStatus.Pending, restaurant, customer);
  }

  static fromPersistance(
    id: string,
    status: OrderStatus,
    restaurant: RestaurantEntity,
    customer: CustomerEntity,
    driver?: DriverEntity,
    rejectedDrivers?: DriverEntity[],
  ): OrderEntity {
    const orderEntity = new OrderEntity(id, status, restaurant, customer);

    if (driver) {
      orderEntity._driver = driver;
    }

    if (rejectedDrivers) {
      orderEntity._rejectedDrivers = rejectedDrivers;
    }

    return orderEntity;
  }

  get id(): string {
    return this._id;
  }

  get status(): OrderStatus {
    return this._status;
  }

  get restaurant(): RestaurantEntity {
    return this._restaurant;
  }

  get customer(): CustomerEntity {
    return this._customer;
  }

  get driver(): DriverEntity {
    return this._driver;
  }

  get rejectedDrivers(): DriverEntity[] {
    return this._rejectedDrivers;
  }

  isOwnedBy(customer: CustomerEntity): boolean {
    return this._customer.id === customer.id;
  }

  ensureOwnedBy(customer: CustomerEntity) {
    if (!this.isOwnedBy(customer)) {
      throw new UnauthorizedException('You do not own this order');
    }
  }

  markAccepted() {
    if (this._status !== OrderStatus.Pending) {
      throw new Error('Order is not in a state to be accepted');
    }
    this._status = OrderStatus.Accepted;
  }

  markRejected() {
    if (this._status !== OrderStatus.Pending) {
      throw new Error('Order is not in a state to be rejected');
    }
    this._status = OrderStatus.Rejected;
  }

  markReady() {
    if (this._status !== OrderStatus.Accepted) {
      throw new Error('Order is not in a state to be marked as ready');
    }
    this._status = OrderStatus.Ready;
  }

  assignDriver(driver: DriverEntity) {
    if (
      this._status !== OrderStatus.Accepted &&
      this._status !== OrderStatus.Ready
    ) {
      throw new Error(
        'Driver can only be assigned to an accepted or ready order',
      );
    }
    if (this._driver) {
      throw new Error('Driver is already assigned to this order');
    }
    this._driver = driver;
  }

  markRejectedByDriver(driver: DriverEntity) {
    if (
      this._status !== OrderStatus.Accepted &&
      this._status !== OrderStatus.Ready
    ) {
      throw new Error('Order is not in a state to be rejected by driver');
    }

    this._rejectedDrivers.push(driver);
  }

  markPickedUp(driver: DriverEntity) {
    if (!this._driver || this._driver.id !== driver.id) {
      throw new Error('Only the assigned driver can pick up this order');
    }
    if (this._status !== OrderStatus.Ready) {
      throw new Error('Order is not in a state to be picked up');
    }
    this._status = OrderStatus.PickedUp;
  }

  markDelivered(driver: DriverEntity) {
    if (!this._driver || this._driver.id !== driver.id) {
      throw new Error('Only the assigned driver can deliver this order');
    }
    if (this._status !== OrderStatus.PickedUp) {
      throw new Error('Order is not in a state to be delivered');
    }
    this._status = OrderStatus.Delivered;
  }
}
