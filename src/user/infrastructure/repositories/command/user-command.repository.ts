import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserOrmEntity } from '../../orm-entities/user.orm.entity';
import { IUserCommandRepository } from 'src/user/application/command/repositories/user-command.repository.interface';
import { UserProjection } from 'src/user/application/command/projections/user.projection';

@Injectable()
export class UserCommandRepository implements IUserCommandRepository {
  constructor(private readonly em: EntityManager) {}

  async save(user: UserOrmEntity): Promise<UserOrmEntity> {
    return await this.em.save(UserOrmEntity, user);
  }

  async findByEmail(email: string): Promise<UserProjection | undefined> {
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
      .getRawOne<UserProjection>();

    return result;
  }
}
