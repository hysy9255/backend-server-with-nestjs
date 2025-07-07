import { EntityManager } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  IUserQueryRepository,
  UserQueryProjection,
} from 'src/user/infrastructure/repositories/query/user/user-query.repository.interface';

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

    return result ? result : null;
  }

  async findById(id: string): Promise<UserQueryProjection> {
    const result = await this.em
      .createQueryBuilder()
      .select(['user.id AS id', 'user.email AS email', 'user.role AS role'])
      .from('user', 'user')
      .where('user.id = :id', { id })
      .getRawOne();

    if (!result) throw new UnauthorizedException('User Not Found');

    return result;
  }
}
