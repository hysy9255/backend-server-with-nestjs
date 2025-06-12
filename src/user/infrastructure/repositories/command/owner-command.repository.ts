import { Injectable } from '@nestjs/common';
import { IOwnerCommandRepository } from '../../../application/command/repositories/owner-command.repository.interface';
import { EntityManager } from 'typeorm';
import { OwnerProjection } from 'src/user/application/command/projections/owner.projection';
import { OwnerOrmEntity } from '../../orm-entities/owner.orm.entity';

@Injectable()
export class OwnerCommandRepository implements IOwnerCommandRepository {
  constructor(private readonly em: EntityManager) {}

  // used
  async save(owner: OwnerOrmEntity): Promise<void> {
    await this.em.save(OwnerOrmEntity, owner);
  }

  // used
  async findByUserId(userId: string): Promise<OwnerProjection | null> {
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
