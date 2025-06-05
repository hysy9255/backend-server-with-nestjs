import { UserRecord } from 'src/user/orm-records/user.record';
import { DriverRecord } from '../../orm-records/driver.record';

export interface DriverRepository {
  save(driverRecord: DriverRecord): Promise<void>;
  findByUserId(userId: string): Promise<DriverRecord | null>;
  findById(id: string): Promise<DriverRecord | null>;
}
