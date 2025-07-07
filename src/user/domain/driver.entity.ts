import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { OrderForDriver } from 'src/order/infrastructure/repositories/query/projections/order.projection';

export class DriverEntity {
  // private _rejectedOrders?: OrderEntity[];
  // private _assignedOrders?: OrderEntity[];

  constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private _hasActiveOrder: boolean = false,
    // private _rejectedOrders: OrderEntity[] = [],
  ) {}

  markOrderAccepted() {
    if (this._hasActiveOrder) {
      throw new BadRequestException('Driver already has an active order');
    }
    this._hasActiveOrder = true;
  }

  markOrderCompleted() {
    this._hasActiveOrder = false;
  }

  static createNew(userId: string) {
    return new DriverEntity(uuidv4(), userId);
  }

  static fromPersistance(id: string, userId: string, hasActiveOrder: boolean) {
    return new DriverEntity(id, userId, hasActiveOrder);
  }

  ensureCanAccessOrderOf(order: OrderForDriver) {
    const noDriverAssigned = !order.driverId;
    const isAssignedToThisDriver = order.driverId === this.id;

    if (!noDriverAssigned || !isAssignedToThisDriver) {
      throw new ForbiddenException('You are not allowed to access this order.');
    }
  }

  canAccessOrderOf(order: OrderForDriver) {
    const noDriverAssigned = !order.driverId;
    const isAssignedToThisDriver = order.driverId === this.id;

    return noDriverAssigned || isAssignedToThisDriver;
  }

  get id() {
    return this._id;
  }

  get userId() {
    return this._userId;
  }

  get hasActiveOrder() {
    return this._hasActiveOrder;
  }

  // get rejectedOrders() {
  //   return this._rejectedOrders;
  // }

  // get assignedOrders() {
  //   return this._assignedOrders;
  // }
}
