import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserOrmEntity } from '../../orm-entities/user.orm.entity';
import {
  IUserCommandRepository,
  UserCmdProjection,
} from './user-command.repository.interface';

@Injectable()
export class UserCommandRepository implements IUserCommandRepository {
  constructor(private readonly em: EntityManager) {}

  async save(user: UserOrmEntity): Promise<UserOrmEntity> {
    return await this.em.save(UserOrmEntity, user);
  }

  async findByEmail(email: string): Promise<UserCmdProjection | undefined> {
    const result = await this.em
      .createQueryBuilder()
      .select([
        'user.id AS id',
        'user.email AS email',
        'user.password AS password',
        'user.role AS role',
      ])
      .from('user', 'user')
      .where('user.email = :email', { email })
      .getRawOne<UserCmdProjection>();

    return result;
  }

  async findByUserId(userId: string): Promise<UserCmdProjection | undefined> {
    const result = await this.em
      .createQueryBuilder()
      .select([
        'user.id AS id',
        'user.email AS email',
        'user.password AS password',
        'user.role AS role',
      ])
      .from('user', 'user')
      .where('user.id = :id', { id: userId })
      .getRawOne<UserCmdProjection>();

    return result;
  }
}
