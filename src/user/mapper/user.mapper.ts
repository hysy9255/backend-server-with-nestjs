import { UserEntity } from '../domain/user.entity';
import { UserOrmEntity } from '../orm-entities/user.orm.entity';

export class UserMapper {
  static toRecord(userEntity: UserEntity): UserOrmEntity {
    const userRecord = new UserOrmEntity();
    userRecord.id = userEntity.id;
    userRecord.email = userEntity.email;
    userRecord.password = userEntity.password;
    userRecord.role = userEntity.role;

    return userRecord;
  }

  static toDomain(userRecord: UserOrmEntity): UserEntity {
    return UserEntity.fromPersistance(
      userRecord.id,
      userRecord.email,
      userRecord.password,
      userRecord.role,
    );
  }
}
