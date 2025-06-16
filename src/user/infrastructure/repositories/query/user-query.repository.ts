import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import {
  IUserQueryRepository,
  UserQueryProjection,
} from 'src/user/infrastructure/repositories/query/user-query.repository.interface';

@Injectable()
export class UserQueryRepository implements IUserQueryRepository {
  constructor(private readonly em: EntityManager) {}

  // used
  async findByEmail(email: string): Promise<UserQueryProjection | null> {
    const result = await this.em
      .createQueryBuilder()
      .select(['user.id AS id', 'user.email AS email', 'user.role AS role'])
      .from('user', 'user')
      .where('user.email = :email', { email })
      .getRawOne();
    return result;
  }

  async findById(id: string): Promise<UserQueryProjection | null> {
    const result = await this.em
      .createQueryBuilder()
      .select(['user.id AS id', 'user.email AS email', 'user.role AS role'])
      .from('user', 'user')
      .where('user.id = :id', { id })
      .getRawOne();

    return result;
  }
}
