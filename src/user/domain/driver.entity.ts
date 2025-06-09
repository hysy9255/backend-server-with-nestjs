import { OrderEntity } from 'src/order/domain/order.entity';
import { v4 as uuidv4 } from 'uuid';

export class DriverEntity {
  private _rejectedOrders?: OrderEntity[];
  private _assignedOrders?: OrderEntity[];

  constructor(
    private readonly _id: string,
    private readonly _userId: string,
  ) {}

  static createNew(userId: string) {
    return new DriverEntity(uuidv4(), userId);
  }

  static fromPersistance(
    id: string,
    userId: string,
    // rejectedOrders: OrderEntity[],
    // assignedOrders: OrderEntity[],
  ) {
    const driver = new DriverEntity(id, userId);

    // if (rejectedOrders) {
    //   driver._rejectedOrders = rejectedOrders;
    // }

    // if (assignedOrders) {
    //   driver._assignedOrders = assignedOrders;
    // }

    return driver;
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
