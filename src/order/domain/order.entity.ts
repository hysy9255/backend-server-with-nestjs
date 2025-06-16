import { BadRequestException, ConflictException } from '@nestjs/common';
import { OrderStatus } from 'src/constants/orderStatus';
import { CustomerEntity } from 'src/user/domain/customer.entity';
import { DriverEntity } from 'src/user/domain/driver.entity';
import { v4 as uuidv4 } from 'uuid';

export class OrderEntity {
  constructor(
    private readonly _id: string,
    private _status: OrderStatus,
    private readonly _restaurantId: string,
    private readonly _customerId: string,
    private _driverId?: string,
    private _rejectedDriverIds: string[] = [],
  ) {}

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

  isOwnedBy(customer: CustomerEntity): boolean {
    return this._customerId === customer.id;
  }

  markAccepted() {
    if (this._status === OrderStatus.Accepted)
      throw new ConflictException('You have already accepted this order');

    if (this._status !== OrderStatus.Pending)
      throw new BadRequestException('Order is not in a state to be accepted');

    this._status = OrderStatus.Accepted;
  }

  markRejected() {
    if (this._status === OrderStatus.Rejected)
      throw new ConflictException('You have already rejected this order');

    if (this._status !== OrderStatus.Pending)
      throw new BadRequestException('Order is not in a state to be rejected');

    this._status = OrderStatus.Rejected;
  }

  markReady() {
    if (this._status === OrderStatus.Ready)
      throw new ConflictException('You have already marked this order ready');

    if (this._status !== OrderStatus.Accepted)
      throw new BadRequestException(
        'Order is not in a state to be marked ready',
      );

    this._status = OrderStatus.Ready;
  }

  assignDriver(driver: DriverEntity) {
    if (
      this._status !== OrderStatus.Accepted &&
      this._status !== OrderStatus.Ready
    ) {
      throw new BadRequestException(
        'Driver can only be assigned to an accepted or ready order',
      );
    }
    if (this._rejectedDriverIds.includes(driver.id)) {
      throw new ConflictException(
        'You cannot assign this order to a driver who has already rejected it',
      );
    }
    if (this._driverId) {
      if (this._driverId === driver.id) {
        throw new ConflictException('You already have accepted this order');
      }

      throw new ConflictException(
        'Antoher driver is already assigned to this order',
      );
    }
    this._driverId = driver.id;
  }

  markRejectedByDriver(driver: DriverEntity) {
    if (
      this._status !== OrderStatus.Accepted &&
      this._status !== OrderStatus.Ready
    ) {
      throw new BadRequestException(
        'Order is not in a state to be rejected by driver',
      );
    }
    if (this._rejectedDriverIds.includes(driver.id)) {
      throw new ConflictException('You have already rejected this order');
    }
    if (this._driverId) {
      throw new ConflictException(
        'You cannot reject this order because it has already been assigned to another driver.',
      );
    }

    this._rejectedDriverIds.push(driver.id);
  }

  markPickedUp(driver: DriverEntity) {
    if (this._status !== OrderStatus.Ready) {
      throw new BadRequestException('Order is not in a state to be picked up');
    }
    if (!this._driverId || this._driverId !== driver.id) {
      throw new BadRequestException(
        'Only the assigned driver can pick up this order',
      );
    }

    this._status = OrderStatus.PickedUp;
  }

  markDelivered(driver: DriverEntity) {
    if (this._status !== OrderStatus.PickedUp) {
      throw new BadRequestException('Order is not in a state to be delivered');
    }
    if (!this._driverId || this._driverId !== driver.id) {
      throw new BadRequestException(
        'Only the assigned driver can deliver this order',
      );
    }

    this._status = OrderStatus.Delivered;
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

  get driverId(): string | undefined {
    return this._driverId;
  }

  get rejectedDriverIds(): string[] {
    return this._rejectedDriverIds;
  }
}
