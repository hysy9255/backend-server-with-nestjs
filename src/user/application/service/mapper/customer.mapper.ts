import { CustomerOrmEntity } from 'src/user/infrastructure/orm-entities/customer.orm.entity';
import { CustomerEntity } from '../../../domain/customer.entity';
import { CustomerCmdProjection } from 'src/user/infrastructure/repositories/command/customer-command.repository.interface';

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
  static toDomain(projection: CustomerCmdProjection): CustomerEntity {
    return CustomerEntity.fromPersistance(
      projection.id,
      projection.userId,
      projection.deliveryAddress,
    );
  }
}
