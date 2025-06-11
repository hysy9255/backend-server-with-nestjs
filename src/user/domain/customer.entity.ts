import { OrderEntity } from 'src/order/domain/order.entity';
import { v4 as uuidv4 } from 'uuid';

export class CustomerEntity {
  private _orders?: OrderEntity[];

  constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private _deliveryAddress: string,
  ) {}

  // used
  static createNew(userId: string, deliveryAddress: string) {
    return new CustomerEntity(uuidv4(), userId, deliveryAddress);
  }

  // used
  static fromPersistance(id: string, userId: string, deliverAddress: string) {
    return new CustomerEntity(id, userId, deliverAddress);
  }

  // used
  idMatches(id: string): boolean {
    return this._id === id;
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
