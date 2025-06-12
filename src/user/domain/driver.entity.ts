import { DriverOrderSummaryProjection } from 'src/order/application/query/projections/order.projection';
import { OrderEntity } from 'src/order/domain/order.entity';
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
  canAccessOrderOf(order: DriverOrderSummaryProjection) {
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

  get rejectedOrders() {
    return this._rejectedOrders;
  }

  get assignedOrders() {
    return this._assignedOrders;
  }
}
