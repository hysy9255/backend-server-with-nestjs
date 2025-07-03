import { ClientOrmEntity } from 'src/user/infrastructure/orm-entities/client.orm.entity';

export class ClientCmdProjection {
  id: string;
  userId: string;
  deliveryAddress: string;
}

export interface IClientCommandRepository {
  save(clientRecord: ClientOrmEntity);
  findByUserId(userId: string): Promise<ClientCmdProjection | null>;
}
