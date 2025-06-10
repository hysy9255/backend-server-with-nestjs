import { CustomerEntity } from '../domain/customer.entity';
import { CustomerOrmEntity } from '../orm-entities/customer.orm.entity';

export class CustomerMapper {
  // used
  static toOrmEntity(entity: CustomerEntity): CustomerOrmEntity {
    const record = new CustomerOrmEntity();
    record.id = entity.id;
    record.userId = entity.userId;
    record.deliveryAddress = entity.deliveryAddress;

    return record;
  }

  // used
  static toDomain(record: CustomerOrmEntity): CustomerEntity {
    return CustomerEntity.fromPersistance(
      record.id,
      record.userId,
      record.deliveryAddress,
    );
  }
}
