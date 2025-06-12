import { CustomerOrmEntity } from 'src/user/infrastructure/orm-entities/customer.orm.entity';
import { CustomerEntity } from '../../../domain/customer.entity';
import { CustomerProjection } from '../../command/projections/customer.projection';

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
  static toDomain(projection: CustomerProjection): CustomerEntity {
    return CustomerEntity.fromPersistance(
      projection.id,
      projection.userId,
      projection.deliveryAddress,
    );
  }
}
