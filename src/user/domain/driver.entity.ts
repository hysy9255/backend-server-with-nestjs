import { OrderEntity } from 'src/order/domain/order.entity';
import { DriverOrderSummaryProjection } from 'src/order/projections/orderSummaryForDriver.projection';
import { v4 as uuidv4 } from 'uuid';

export class DriverEntity {
  private _rejectedOrders?: OrderEntity[];
  private _assignedOrders?: OrderEntity[];

  constructor(
    private readonly _id: string,
    private readonly _userId: string,
  ) {}

  // used
  static createNew(userId: string) {
    return new DriverEntity(uuidv4(), userId);
  }

  // used
  static fromPersistance(id: string, userId: string) {
    return new DriverEntity(id, userId);
  }

  // used
  ensureCanAccessOrderOf(order: DriverOrderSummaryProjection) {
    if (order.driverId !== null) {
      if (order.driverId !== this.id) {
        throw new Error(
          "You can't access an order that has been assigned to other driver",
        );
      }
    }
  }

  get id() {
    return this._id;
  }

  get userId() {
    return this._userId;
  }

  get rejectedOrders() {
    return this._rejectedOrders;
  }

  get assignedOrders() {
    return this._assignedOrders;
  }
}
