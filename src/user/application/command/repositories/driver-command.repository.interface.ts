import { DriverOrmEntity } from 'src/user/infrastructure/orm-entities/driver.orm.entity';
import { DriverProjection } from '../projections/driver.projection';

export interface IDriverCommandRepository {
  save(driverRecord: DriverOrmEntity): Promise<void>;
  findByUserId(userId: string): Promise<DriverProjection | null>;
}
