import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { IClientQueryRepository } from './client-query.repository.interface';
import { UserInfoProjection } from '../user.info.projection';

@Injectable()
export class ClientQueryRepository implements IClientQueryRepository {
  constructor(private readonly em: EntityManager) {}

  async findByUserId(userId: string): Promise<UserInfoProjection | null> {
    const result = await this.em
      .createQueryBuilder()
      .select([
        'client.id AS "clientId"',
        'client.userId AS "userId"',
        'user.role AS role',
      ])
      .from('client', 'client')
      .leftJoin('user', 'user', 'user.id = client.userId')
      .where('client.userId = :userId', { userId })
      .getRawOne();

    return result ? result : null;
  }
}
