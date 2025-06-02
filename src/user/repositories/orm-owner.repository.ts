import { Injectable } from '@nestjs/common';
import { OwnerRepository } from './owner-repository.interface';
import { EntityManager } from 'typeorm';
import { OwnerRecord } from '../orm-records/owner.record';

@Injectable()
export class OrmOwnerRepository implements OwnerRepository {
  constructor(private readonly em: EntityManager) {}

  async save(owner: OwnerRecord) {
    return await this.em.save(OwnerRecord, owner);
  }
}
