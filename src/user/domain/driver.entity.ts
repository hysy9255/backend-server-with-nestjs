import { OrderEntity } from 'src/order/domain/order.entity';
import { OrderMapper } from 'src/order/mapper/order.mapper';
import { OrderRecord } from 'src/order/orm-records/order.record';
import { v4 as uuidv4 } from 'uuid';

export class DriverEntity {
  private _rejectedOrders?: OrderEntity[];
  private _assignedOrders?: OrderEntity[];

  constructor(private readonly _id: string) {}

  static createNew() {
    return new DriverEntity(uuidv4());
  }

  static fromPersistance(
    id: string,
    rejectedOrders: OrderRecord[],
    assignedOrders: OrderRecord[],
  ) {
    const driver = new DriverEntity(id);

    if (rejectedOrders) {
      driver._rejectedOrders = rejectedOrders.map((rejectedOrder) =>
        OrderMapper.toDomain(rejectedOrder),
      );
    }

    if (assignedOrders) {
      driver._assignedOrders = assignedOrders.map((assignedOrder) =>
        OrderMapper.toDomain(assignedOrder),
      );
    }

    return driver;
  }

  get id() {
    return this._id;
  }

  get rejectedOrders() {
    return this._rejectedOrders;
  }

  get assignedOrders() {
    return this._assignedOrders;
  }
}
