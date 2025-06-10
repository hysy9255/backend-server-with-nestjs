import { OwnerEntity } from '../domain/owner.entity';
import { OwnerOrmEntity } from '../orm-entities/owner.orm.entity';
import { OwnerProjection } from '../projections/owner.projection';

export class OwnerMapper {
  // used
  static toOrmEntity(entity: OwnerEntity): OwnerOrmEntity {
    const record = new OwnerOrmEntity();
    record.id = entity.id;
    record.userId = entity.userId;

    return record;
  }

  // used
  static toDomain(projection: OwnerProjection): OwnerEntity {
    return OwnerEntity.fromPersistance(
      projection.id,
      projection.userId,
      projection.restaurantId ? projection.restaurantId : undefined,
    );
  }
}
