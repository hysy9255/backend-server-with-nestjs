import { UserRepository } from '../interfaces/user-repository.interface';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserRecord } from '../../orm-records/user.record';

@Injectable()
export class OrmUserRepository implements UserRepository {
  constructor(private readonly em: EntityManager) {}

  async save(user: UserRecord): Promise<UserRecord> {
    return await this.em.save(UserRecord, user);
  }

  async findByEmail(email: string) {
    return await this.em.findOne(UserRecord, { where: { email } });
  }

  async findById(id: string): Promise<UserRecord | null> {
    return await this.em.findOne(UserRecord, {
      where: { id },
    });
  }

  async findWithAssociatedRestaurantById(
    id: string,
  ): Promise<UserRecord | null> {
    return await this.em.findOne(UserRecord, {
      where: { id },
      relations: ['restaurant'],
    });
  }
}
