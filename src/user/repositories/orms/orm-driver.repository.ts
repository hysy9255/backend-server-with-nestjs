import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserRecord } from 'src/user/orm-records/user.record';
import { DriverRepository } from '../interfaces/driver-repository.interface';
import { DriverRecord } from 'src/user/orm-records/driver.record';

@Injectable()
export class OrmDriverRepository implements DriverRepository {
  constructor(private readonly em: EntityManager) {}

  async save(driverRecord: DriverRecord): Promise<void> {
    await this.em.save(DriverRecord, driverRecord);
  }

  async findById(id: string): Promise<DriverRecord | null> {
    return await this.em.findOne(DriverRecord, {
      where: { id },
    });
  }

  async findByUserId(userId: string): Promise<DriverRecord | null> {
    return await this.em.findOne(DriverRecord, {
      where: { userId },
    });
  }
}
