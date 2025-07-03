import { ClientCmdProjection } from 'src/user/infrastructure/repositories/command/client/client-command.repository.interface';
import { ClientEntity } from '../../domain/client.entity';
import { ClientOrmEntity } from 'src/user/infrastructure/orm-entities/client.orm.entity';

export class ClientMapper {
  static toOrmEntity(entity: ClientEntity): ClientOrmEntity {
    const record = new ClientOrmEntity();
    record.id = entity.id;
    record.userId = entity.userId;
    record.deliveryAddress = entity.deliveryAddress;

    return record;
  }

  static toDomain(projection: ClientCmdProjection): ClientEntity {
    return ClientEntity.fromPersistance(
      projection.id,
      projection.userId,
      projection.deliveryAddress,
    );
  }
}
