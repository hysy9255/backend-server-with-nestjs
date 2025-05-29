import { v4 as uuidv4 } from 'uuid';

export class RestaurantEntity {
  constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _address: string,
    private readonly _category: string,
  ) {}

  static createNew(
    name: string,
    address: string,
    category: string,
  ): RestaurantEntity {
    return new RestaurantEntity(uuidv4(), name, address, category);
  }

  static fromPersistance(
    id: string,
    name: string,
    address: string,
    category: string,
  ): RestaurantEntity {
    return new RestaurantEntity(id, name, address, category);
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get address() {
    return this._address;
  }

  get category() {
    return this._category;
  }
}
