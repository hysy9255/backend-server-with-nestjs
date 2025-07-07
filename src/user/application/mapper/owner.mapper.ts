import { OwnerOrmEntity } from 'src/user/infrastructure/orm-entities/owner.orm.entity';
import { OwnerEntity } from '../../domain/owner.entity';
import { OwnerCmdProjection } from 'src/user/infrastructure/repositories/command/owner/owner-command.repository.interface';

export class OwnerMapper {
  // used
  static toOrmEntity(entity: OwnerEntity): OwnerOrmEntity {
    const record = new OwnerOrmEntity();
    record.id = entity.id;
    record.userId = entity.userId;

    return record;
  }

  // used
  static toDomain(projection: OwnerCmdProjection): OwnerEntity {
    return OwnerEntity.fromPersistance(
      projection.id,
      projection.userId,
      projection.restaurantId ? projection.restaurantId : undefined,
    );
  }
}
