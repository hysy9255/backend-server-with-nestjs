import { v4 as uuidv4 } from 'uuid';
import { ForbiddenException } from '@nestjs/common';
import { OrderForDriver } from 'src/order/infrastructure/repositories/query/projections/order.projection';

export class DriverEntity {
  // private _rejectedOrders?: OrderEntity[];
  // private _assignedOrders?: OrderEntity[];

  constructor(
    private readonly _id: string,
    private readonly _userId: string,
    // private _rejectedOrders: OrderEntity[] = [],
  ) {}

  // used
  static createNew(userId: string) {
    return new DriverEntity(uuidv4(), userId);
  }

  // used
  static fromPersistance(id: string, userId: string) {
    return new DriverEntity(id, userId);
  }

  ensureCanAccessOrderOf(order: OrderForDriver) {
    const noDriverAssigned = !order.driverId;
    const isAssignedToThisDriver = order.driverId === this.id;

    if (!noDriverAssigned || !isAssignedToThisDriver) {
      throw new ForbiddenException('You are not allowed to access this order.');
    }
  }

  // used
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

  // get rejectedOrders() {
  //   return this._rejectedOrders;
  // }

  // get assignedOrders() {
  //   return this._assignedOrders;
  // }
}
