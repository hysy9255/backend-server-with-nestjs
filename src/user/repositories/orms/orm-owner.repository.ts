import { Injectable } from '@nestjs/common';
import { OwnerRepository } from '../interfaces/owner-repository.interface';
import { EntityManager } from 'typeorm';
import { OwnerRecord } from '../../orm-records/owner.record';

@Injectable()
export class OrmOwnerRepository implements OwnerRepository {
  constructor(private readonly em: EntityManager) {}

  async save(owner: OwnerRecord): Promise<void> {
    await this.em.save(OwnerRecord, owner);
  }

  async findById(id: string): Promise<OwnerRecord | null> {
    return await this.em.findOne(OwnerRecord, { where: { id } });
  }

  async findByUserId(userId: string): Promise<OwnerRecord | null> {
    return await this.em.findOne(OwnerRecord, {
      where: { userId },
    });
  }
}
