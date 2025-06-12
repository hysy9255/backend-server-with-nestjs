import { UserOrmEntity } from 'src/user/infrastructure/orm-entities/user.orm.entity';
import { UserProjection } from '../projections/user.projection';

export interface IUserCommandRepository {
  save(user: UserOrmEntity): Promise<UserOrmEntity>;
  findByEmail(email: string): Promise<UserProjection | undefined>;
  findByUserId(userId: string): Promise<UserProjection | undefined>;
}
