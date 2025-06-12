import { UserOrmEntity } from 'src/user/infrastructure/orm-entities/user.orm.entity';
import { UserProjection } from '../projections/user.projection';

export interface IUserCommandRepository {
  save(user: UserOrmEntity): Promise<UserOrmEntity>;
  // findById(id: string): Promise<UserProjection | undefined>;
  findByEmail(id: string): Promise<UserProjection | undefined>;
}
