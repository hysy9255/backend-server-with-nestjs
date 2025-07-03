import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserInfoProjection } from '../user.info.projection';
import { IOwnerQueryRepository } from './owner-query.repository.interface';

@Injectable()
export class OwnerQueryRepository implements IOwnerQueryRepository {
  constructor(private readonly em: EntityManager) {}

  async findByUserId(userId: string): Promise<UserInfoProjection | null> {
    const result = await this.em
      .createQueryBuilder()
      .select([
        'owner.id AS "ownerId"',
        'owner.userId AS "userId"',
        'user.role AS role',
      ])
      .from('owner', 'owner')
      .leftJoin('user', 'user', 'user.id = owner.userId')
      .where('owner.userId = :userId', { userId })
      .getRawOne();

    return result ? result : null;
  }
}
