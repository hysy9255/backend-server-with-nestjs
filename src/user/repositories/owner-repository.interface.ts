import { OwnerRecord } from '../orm-records/owner.record';

export interface OwnerRepository {
  save(owner: OwnerRecord);
}
