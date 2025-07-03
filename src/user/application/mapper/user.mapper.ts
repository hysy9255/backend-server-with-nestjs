import { UserOrmEntity } from 'src/user/infrastructure/orm-entities/user.orm.entity';
import { UserCmdProjection } from 'src/user/infrastructure/repositories/command/user/user-command.repository.interface';
import { UserEntity } from '../../domain/user.entity';

export class UserMapper {
  // used
  static toOrmEntity(entity: UserEntity): UserOrmEntity {
    const record = new UserOrmEntity();
    record.id = entity.id;
    record.email = entity.email;
    record.password = entity.password;
    record.role = entity.role;

    return record;
  }

  // used
  static toDomain(projection: UserCmdProjection): UserEntity {
    return UserEntity.fromPersistance(
      projection.id,
      projection.email,
      projection.password,
      projection.role,
    );
  }
}
