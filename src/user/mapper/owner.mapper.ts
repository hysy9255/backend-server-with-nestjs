import { RestaurantMapper } from 'src/restaurant/mapper/restaurant.mapper';
import { OwnerEntity } from '../domain/owner.entity';
import { OwnerRecord } from '../orm-records/owner.record';

export class OwnerMapper {
  static toRecord(ownerEntity: OwnerEntity): OwnerRecord {
    const ownerRecord = new OwnerRecord();
    ownerRecord.id = ownerEntity.id;

    return ownerRecord;
  }

  static toDomain(ownerRecord: OwnerRecord): OwnerEntity {
    const restaurant = ownerRecord.restaurant
      ? RestaurantMapper.toDomain(ownerRecord.restaurant)
      : undefined;

    return OwnerEntity.fromPersistance(ownerRecord.id, restaurant);
  }
}
