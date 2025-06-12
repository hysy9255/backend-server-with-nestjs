import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { IDriverCommandRepository } from '../../../application/command/repositories/driver-command.repository.interface';
import { DriverOrmEntity } from '../../orm-entities/driver.orm.entity';
import { DriverProjection } from 'src/user/application/command/projections/driver.projection';

@Injectable()
export class DriverCommandRepository implements IDriverCommandRepository {
  constructor(private readonly em: EntityManager) {}

  async save(driverRecord: DriverOrmEntity): Promise<void> {
    await this.em.save(DriverOrmEntity, driverRecord);
  }

  async findByUserId(userId: string): Promise<DriverProjection | null> {
    const result = await this.em
      .createQueryBuilder()
      .select(['driver.id AS id', 'driver.userId AS "userId"'])
      .from('driver', 'driver')
      .where('driver.userId = :userId', { userId })
      .getRawOne();
    return result;
  }
}
