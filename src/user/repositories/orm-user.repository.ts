import { UserRepository } from './user-repository.interface';
import { User } from '../domain/user.entity';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrmUserRepository implements UserRepository {
  constructor(private readonly em: EntityManager) {}

  async save(user: User): Promise<User> {
    return await this.em.save(User, user);
  }

  async findByEmail(email: string) {
    return await this.em.findOne(User, { where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return await this.em.findOne(User, { where: { id } });
  }
}
