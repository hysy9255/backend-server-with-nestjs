import { DriverOrmEntity } from 'src/user/infrastructure/orm-entities/driver.orm.entity';

export class DriverCmdProjection {
  id: string;
  userId: string;
  hasActiveOrder: boolean;
}

export interface IDriverCommandRepository {
  save(driverRecord: DriverOrmEntity): Promise<void>;
  findByUserId(userId: string): Promise<DriverCmdProjection | null>;
}
