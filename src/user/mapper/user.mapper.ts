import { UserEntity } from '../domain/user.entity';
import { UserOrmEntity } from '../orm-entities/user.orm.entity';

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
  static toDomain(record: UserOrmEntity): UserEntity {
    return UserEntity.fromPersistance(
      record.id,
      record.email,
      record.password,
      record.role,
    );
  }
}
