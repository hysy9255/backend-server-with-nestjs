import { OwnerEntity } from '../domain/owner.entity';
import { OwnerOrmEntity } from '../orm-entities/owner.orm.entity';

export class OwnerMapper {
  static toRecord(ownerEntity: OwnerEntity): OwnerOrmEntity {
    const ownerRecord = new OwnerOrmEntity();
    ownerRecord.id = ownerEntity.id;
    ownerRecord.userId = ownerEntity.userId;
    ownerRecord.restaurantId = ownerEntity.restaurantId
      ? ownerEntity.restaurantId
      : null;
    return ownerRecord;
  }

  static toDomain(ownerRecord: OwnerOrmEntity): OwnerEntity {
    return OwnerEntity.fromPersistance(
      ownerRecord.id,
      ownerRecord.userId,
      ownerRecord.restaurantId ? ownerRecord.restaurantId : undefined,
    );
  }
}
