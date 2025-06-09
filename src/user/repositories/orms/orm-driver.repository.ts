import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { DriverRepository } from '../interfaces/driver-repository.interface';
import { DriverOrmEntity } from 'src/user/orm-entities/driver.orm.entity';

@Injectable()
export class OrmDriverRepository implements DriverRepository {
  constructor(private readonly em: EntityManager) {}

  async save(driverRecord: DriverOrmEntity): Promise<void> {
    await this.em.save(DriverOrmEntity, driverRecord);
  }

  async findById(id: string): Promise<DriverOrmEntity | null> {
    return await this.em.findOne(DriverOrmEntity, {
      where: { id },
    });
  }

  async findByUserId(userId: string): Promise<DriverOrmEntity | null> {
    return await this.em.findOne(DriverOrmEntity, {
      where: { userId },
    });
  }
}
