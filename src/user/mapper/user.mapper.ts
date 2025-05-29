import { UserEntity } from '../domain/user.entity';
import { UserRecord } from '../orm-records/user.record';

export class UserMapper {
  static toRecord(userEntity: UserEntity): UserRecord {
    const userRecord = new UserRecord();
    userRecord.id = userEntity.id;
    userRecord.email = userEntity.email;
    userRecord.password = userEntity.password;
    userRecord.role = userEntity.role;
    // orderEntity.restaurant = RestaurantMapper.toEntity(orderModel.restaurant);
    // orderEntity.customer = CustomerMapper.toEntity(orderModel.customer);

    return userRecord;
  }

  static toDomain(userRecord: UserRecord): UserEntity {
    return UserEntity.fromPersistance(
      userRecord.id,
      userRecord.email,
      userRecord.password,
      userRecord.role,
      //   RestaurantMapper.toDomain(orderEntity.restaurant),
      //   CustomerMapper.toDomain(orderEntity.customer),
    );
  }
}
