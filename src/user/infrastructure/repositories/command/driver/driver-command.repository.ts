import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import {
  DriverCmdProjection,
  IDriverCommandRepository,
} from './driver-command.repository.interface';
import { DriverOrmEntity } from 'src/user/infrastructure/orm-entities/driver.orm.entity';

@Injectable()
export class DriverCommandRepository implements IDriverCommandRepository {
  constructor(private readonly em: EntityManager) {}

  async save(driverRecord: DriverOrmEntity): Promise<void> {
    await this.em.save(DriverOrmEntity, driverRecord);
  }

  async findByUserId(userId: string): Promise<DriverCmdProjection | null> {
    const result = await this.em
      .createQueryBuilder()
      .select(['driver.id AS id', 'driver.userId AS "userId"'])
      .from('driver', 'driver')
      .where('driver.userId = :userId', { userId })
      .getRawOne();
    return result;
  }
}
