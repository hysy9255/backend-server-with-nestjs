import { RestaurantMapper } from 'src/restaurant/mapper/restaurant.mapper';
import { OwnerEntity } from '../domain/owner.entity';
import { OwnerRecord } from '../orm-records/owner.record';

export class OwnerMapper {
  static toRecord(ownerEntity: OwnerEntity): OwnerRecord {
    const ownerRecord = new OwnerRecord();
    ownerRecord.id = ownerEntity.id;
    ownerRecord.userId = ownerEntity.userId;
    ownerRecord.restaurantId = ownerEntity.restaurantId
      ? ownerEntity.restaurantId
      : null;
    return ownerRecord;
  }

  static toDomain(ownerRecord: OwnerRecord): OwnerEntity {
    return OwnerEntity.fromPersistance(
      ownerRecord.id,
      ownerRecord.userId,
      ownerRecord.restaurantId ? ownerRecord.restaurantId : undefined,
    );
  }
}
