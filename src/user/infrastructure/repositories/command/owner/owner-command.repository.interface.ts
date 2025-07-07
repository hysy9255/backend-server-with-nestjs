import { OwnerOrmEntity } from 'src/user/infrastructure/orm-entities/owner.orm.entity';

export class OwnerCmdProjection {
  id: string;
  userId: string;
  restaurantId?: string | null;
}

export interface IOwnerCommandRepository {
  save(ownerRecord: OwnerOrmEntity);
  findByUserId(userId: string): Promise<OwnerCmdProjection | null>;
}
