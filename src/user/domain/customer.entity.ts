import { OrderEntity } from 'src/order/domain/order.entity';
import { OrderMapper } from 'src/order/mapper/order.mapper';
import { OrderRecord } from 'src/order/orm-records/order.record';
import { v4 as uuidv4 } from 'uuid';

export class CustomerEntity {
  private _orders?: OrderEntity[];

  constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private _deliveryAddress: string,
  ) {}

  static createNew(userId: string, deliveryAddress: string) {
    return new CustomerEntity(uuidv4(), userId, deliveryAddress);
  }

  static fromPersistance(
    id: string,
    userId: string,
    deliverAddress: string,
    // orders?: OrderEntity[],
  ) {
    const customer = new CustomerEntity(id, userId, deliverAddress);

    // if (orders) {
    //   customer._orders = orders;
    // }

    return customer;
  }

  get id() {
    return this._id;
  }

  get userId() {
    return this._userId;
  }

  get deliveryAddress() {
    return this._deliveryAddress;
  }

  get orders() {
    return this._orders;
  }
}
