import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import {
  ClientCmdProjection,
  IClientCommandRepository,
} from './client-command.repository.interface';
import { ClientOrmEntity } from 'src/user/infrastructure/orm-entities/client.orm.entity';

@Injectable()
export class ClientCommandRepository implements IClientCommandRepository {
  constructor(private readonly em: EntityManager) {}

  async save(client: ClientOrmEntity): Promise<void> {
    await this.em.save(ClientOrmEntity, client);
  }

  async findByUserId(userId: string): Promise<ClientCmdProjection | null> {
    const result = await this.em
      .createQueryBuilder()
      .select([
        'client.id AS id',
        'client.userId AS "userId"',
        'client.deliveryAddress AS "deliveryAddress"',
      ])
      .from('client', 'client')
      .where('client.userId = :userId', { userId })
      .getRawOne();

    return result;
  }
}
