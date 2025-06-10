import { Injectable } from '@nestjs/common';
import { OwnerRepository } from '../interfaces/owner-repository.interface';
import { EntityManager } from 'typeorm';
import { OwnerOrmEntity } from 'src/user/orm-entities/owner.orm.entity';
import { OwnerProjection } from 'src/user/projections/owner.projection';

@Injectable()
export class OrmOwnerRepository implements OwnerRepository {
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

  async findById(id: string): Promise<OwnerOrmEntity | null> {
    return await this.em.findOne(OwnerOrmEntity, { where: { id } });
  }

  // async findByUserId(userId: string): Promise<OwnerOrmEntity | null> {
  //   return await this.em.findOne(OwnerOrmEntity, {
  //     where: { userId },
  //   });
  // }
}
