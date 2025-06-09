import { DriverOrmEntity } from 'src/user/orm-entities/driver.orm.entity';

export interface DriverRepository {
  save(driverRecord: DriverOrmEntity): Promise<void>;
  findByUserId(userId: string): Promise<DriverOrmEntity | null>;
  findById(id: string): Promise<DriverOrmEntity | null>;
}
