import { OwnerEntity } from 'src/user/domain/owner.entity';
import { v4 as uuidv4 } from 'uuid';

export class RestaurantEntity {
  private constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _address: string,
    private readonly _category: string,
    // private readonly _owner: OwnerEntity,
    private readonly _ownerId: string,
  ) {}

  static createNew(
    name: string,
    address: string,
    category: string,
    ownerId: string,
    // owner: OwnerEntity,
  ): RestaurantEntity {
    return new RestaurantEntity(uuidv4(), name, address, category, ownerId);
  }

  static fromPersistance(
    id: string,
    name: string,
    address: string,
    category: string,
    ownerId: string,
    // owner: OwnerEntity,
  ): RestaurantEntity {
    return new RestaurantEntity(id, name, address, category, ownerId);
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

  get ownerId() {
    return this._ownerId;
  }
}
