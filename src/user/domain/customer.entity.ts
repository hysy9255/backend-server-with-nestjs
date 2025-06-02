import { OrderEntity } from 'src/order/domain/order.entity';
import { OrderMapper } from 'src/order/mapper/order.mapper';
import { OrderRecord } from 'src/order/orm-records/order.record';
import { v4 as uuidv4 } from 'uuid';

export class CustomerEntity {
  private _orders?: OrderEntity[];

  constructor(
    private readonly _id: string,
    private _deliveryAddress: string,
  ) {}

  static createNew(deliveryAddress: string) {
    return new CustomerEntity(uuidv4(), deliveryAddress);
  }

  static fromPersistance(
    id: string,
    deliverAddress: string,
    orders?: OrderRecord[],
  ) {
    const customer = new CustomerEntity(id, deliverAddress);

    if (orders) {
      customer._orders = orders.map((order) => OrderMapper.toDomain(order));
    }

    return customer;
  }

  get id() {
    return this._id;
  }

  get deliveryAddress() {
    return this._deliveryAddress;
  }

  get orders() {
    return this._orders;
  }
}
