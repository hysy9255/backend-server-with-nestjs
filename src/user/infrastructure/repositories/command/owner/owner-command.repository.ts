import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import {
  IOwnerCommandRepository,
  OwnerCmdProjection,
} from './owner-command.repository.interface';
import { OwnerOrmEntity } from 'src/user/infrastructure/orm-entities/owner.orm.entity';

@Injectable()
export class OwnerCommandRepository implements IOwnerCommandRepository {
  constructor(private readonly em: EntityManager) {}

  // used
  async save(owner: OwnerOrmEntity): Promise<void> {
    await this.em.save(OwnerOrmEntity, owner);
  }

  // used
  async findByUserId(userId: string): Promise<OwnerCmdProjection | null> {
    const result = await this.em
      .createQueryBuilder()
      .select([
        'owner.id AS id',
        'owner.userId AS "userId"',
        'restaurant.id AS "restaurantId"',
      ])
      .from('owner', 'owner')
      .leftJoin('restaurant', 'restaurant', 'restaurant.ownerId = owner.id')
      .where('owner.userId = :userId', { userId })
      .getRawOne();

    return result;
  }
}
