import { OwnerOrmEntity } from 'src/user/orm-entities/owner.orm.entity';
import { OwnerProjection } from 'src/user/projections/owner.projection';

export interface OwnerRepository {
  save(ownerRecord: OwnerOrmEntity);
  // findByUserId(userId: string): Promise<OwnerOrmEntity | null>;
  // used
  findByUserId(userId: string): Promise<OwnerProjection | null>;
  findById(id: string): Promise<OwnerOrmEntity | null>;
}
