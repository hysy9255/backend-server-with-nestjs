import { UserRepository } from '../interfaces/user-repository.interface';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserOrmEntity } from 'src/user/orm-entities/user.orm.entity';

@Injectable()
export class OrmUserRepository implements UserRepository {
  constructor(private readonly em: EntityManager) {}

  async save(user: UserOrmEntity): Promise<UserOrmEntity> {
    return await this.em.save(UserOrmEntity, user);
  }

  // used
  async findByEmail(email: string) {
    return await this.em.findOne(UserOrmEntity, { where: { email } });
  }

  // used
  async findById(id: string): Promise<UserOrmEntity | null> {
    return await this.em.findOne(UserOrmEntity, {
      where: { id },
    });
  }

  // async findWithAssociatedRestaurantById(
  //   id: string,
  // ): Promise<UserOrmEntity | null> {
  //   return await this.em.findOne(UserOrmEntity, {
  //     where: { id },
  //     relations: ['restaurant'],
  //   });
  // }
}
