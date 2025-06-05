import { UnauthorizedException } from '@nestjs/common';
import { OrderStatus } from 'src/constants/orderStatus';
import { RestaurantEntity } from 'src/restaurant/domain/restaurant.entity';
import { CustomerEntity } from 'src/user/domain/customer.entity';
import { DriverEntity } from 'src/user/domain/driver.entity';
import { v4 as uuidv4 } from 'uuid';

export class OrderEntity {
  private _driverId: string;
  private _rejectedDriverIds: string[];

  constructor(
    private readonly _id: string,
    private _status: OrderStatus,
    private readonly _restaurantId: string,
    private readonly _customerId: string,
  ) {
    this._rejectedDriverIds = [];
  }

  static createNew(restaurantId: string, customerId: string): OrderEntity {
    return new OrderEntity(
      uuidv4(),
      OrderStatus.Pending,
      restaurantId,
      customerId,
    );
  }

  static fromPersistance(
    id: string,
    status: OrderStatus,
    restaurantId: string,
    customerId: string,
    driverId?: string,
    rejectedDriverIds?: string[],
  ): OrderEntity {
    const orderEntity = new OrderEntity(id, status, restaurantId, customerId);

    if (driverId) {
      orderEntity._driverId = driverId;
    }

    if (rejectedDriverIds) {
      orderEntity._rejectedDriverIds = rejectedDriverIds;
    }

    return orderEntity;
  }

  get id(): string {
    return this._id;
  }

  get status(): OrderStatus {
    return this._status;
  }

  get restaurantId(): string {
    return this._restaurantId;
  }

  get customerId(): string {
    return this._customerId;
  }

  get driverId(): string {
    return this._driverId;
  }

  get rejectedDriverIds(): string[] {
    return this._rejectedDriverIds;
  }

  isOwnedBy(customer: CustomerEntity): boolean {
    return this._customerId === customer.id;
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
    if (this._driverId) {
      throw new Error('Driver is already assigned to this order');
    }
    this._driverId = driver.id;
  }

  markRejectedByDriver(driver: DriverEntity) {
    if (
      this._status !== OrderStatus.Accepted &&
      this._status !== OrderStatus.Ready
    ) {
      throw new Error('Order is not in a state to be rejected by driver');
    }

    this._rejectedDriverIds.push(driver.id);
  }

  markPickedUp(driver: DriverEntity) {
    if (!this._driverId || this._driverId !== driver.id) {
      throw new Error('Only the assigned driver can pick up this order');
    }
    if (this._status !== OrderStatus.Ready) {
      throw new Error('Order is not in a state to be picked up');
    }
    this._status = OrderStatus.PickedUp;
  }

  markDelivered(driver: DriverEntity) {
    if (!this._driverId || this._driverId !== driver.id) {
      throw new Error('Only the assigned driver can deliver this order');
    }
    if (this._status !== OrderStatus.PickedUp) {
      throw new Error('Order is not in a state to be delivered');
    }
    this._status = OrderStatus.Delivered;
  }
}
