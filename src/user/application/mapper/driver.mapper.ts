import { DriverOrmEntity } from 'src/user/infrastructure/orm-entities/driver.orm.entity';
import { DriverEntity } from '../../domain/driver.entity';
import { DriverCmdProjection } from 'src/user/infrastructure/repositories/command/driver/driver-command.repository.interface';

export class DriverMapper {
  static toOrmEntity(entity: DriverEntity): DriverOrmEntity {
    const record = new DriverOrmEntity();
    record.id = entity.id;
    record.userId = entity.userId;

    return record;
  }

  static toDomain(projection: DriverCmdProjection): DriverEntity {
    return DriverEntity.fromPersistance(projection.id, projection.userId);
  }
}
