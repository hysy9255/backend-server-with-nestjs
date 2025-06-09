import { OwnerOrmEntity } from 'src/user/orm-entities/owner.orm.entity';

export interface OwnerRepository {
  save(ownerRecord: OwnerOrmEntity);
  findByUserId(userId: string): Promise<OwnerOrmEntity | null>;
  findById(id: string): Promise<OwnerOrmEntity | null>;
}
