import { ForbiddenException } from '@nestjs/common';
import { OrderEntity } from 'src/order/domain/order.entity';
import { OrderForClient } from 'src/order/infrastructure/repositories/query/projections/order.projection';
import { v4 as uuidv4 } from 'uuid';

export class ClientEntity {
  // private _orders?: OrderEntity[];

  constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private _deliveryAddress: string,
    private _orders: OrderEntity[] = [],
  ) {}

  static createNew(userId: string, deliveryAddress: string) {
    return new ClientEntity(uuidv4(), userId, deliveryAddress);
  }

  static fromPersistance(id: string, userId: string, deliverAddress: string) {
    return new ClientEntity(id, userId, deliverAddress);
  }

  ensureOwnsOrderOf(order: OrderForClient) {
    if (this._id !== order.clientId)
      throw new ForbiddenException('You do not own this order');
  }

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
