import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserInfoProjection } from '../user.info.projection';
import { IDriverQueryRepository } from './driver-query.repository.interface';

@Injectable()
export class DriverQueryRepository implements IDriverQueryRepository {
  constructor(private readonly em: EntityManager) {}

  async findByUserId(userId: string): Promise<UserInfoProjection | null> {
    const result = await this.em
      .createQueryBuilder()
      .select([
        'driver.id AS driverId',
        'driver.userId AS "userId"',
        'user.role AS role',
      ])
      .from('driver', 'driver')
      .leftJoin('user', 'user', 'user.id = driver.userId')
      .where('driver.userId = :userId', { userId })
      .getRawOne();

    return result ? result : null;
  }
}
