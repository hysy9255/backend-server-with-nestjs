import { Injectable } from '@nestjs/common';
import { OwnerRepository } from '../interfaces/owner-repository.interface';
import { EntityManager } from 'typeorm';
import { OwnerOrmEntity } from 'src/user/orm-entities/owner.orm.entity';

@Injectable()
export class OrmOwnerRepository implements OwnerRepository {
  constructor(private readonly em: EntityManager) {}

  async save(owner: OwnerOrmEntity): Promise<void> {
    await this.em.save(OwnerOrmEntity, owner);
  }

  async findById(id: string): Promise<OwnerOrmEntity | null> {
    return await this.em.findOne(OwnerOrmEntity, { where: { id } });
  }

  async findByUserId(userId: string): Promise<OwnerOrmEntity | null> {
    return await this.em.findOne(OwnerOrmEntity, {
      where: { userId },
    });
  }
}
