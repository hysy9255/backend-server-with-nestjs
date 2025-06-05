import { UserRecord } from 'src/user/orm-records/user.record';
import { OwnerRecord } from '../../orm-records/owner.record';

export interface OwnerRepository {
  save(ownerRecord: OwnerRecord);
  findByUserId(userId: string): Promise<OwnerRecord | null>;
  findById(id: string): Promise<OwnerRecord | null>;
}
