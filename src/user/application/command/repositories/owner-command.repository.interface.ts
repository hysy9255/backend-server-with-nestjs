import { OwnerProjection } from 'src/user/application/command/projections/owner.projection';
import { OwnerOrmEntity } from 'src/user/infrastructure/orm-entities/owner.orm.entity';

export interface IOwnerCommandRepository {
  save(ownerRecord: OwnerOrmEntity);
  findByUserId(userId: string): Promise<OwnerProjection | null>;
}
