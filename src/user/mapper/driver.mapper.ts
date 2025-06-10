import { DriverEntity } from '../domain/driver.entity';
import { DriverOrmEntity } from '../orm-entities/driver.orm.entity';

export class DriverMapper {
  static toOrmEntity(entity: DriverEntity): DriverOrmEntity {
    const record = new DriverOrmEntity();
    record.id = entity.id;
    record.userId = entity.userId;

    return record;
  }

  static toDomain(record: DriverOrmEntity): DriverEntity {
    return DriverEntity.fromPersistance(record.id, record.userId);
  }
}
