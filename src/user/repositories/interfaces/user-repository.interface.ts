import { UserOrmEntity } from 'src/user/orm-entities/user.orm.entity';

export interface UserRepository {
  save(user: UserOrmEntity): Promise<UserOrmEntity>;
  findByEmail(email: string): Promise<UserOrmEntity | null>;
  findById(id: string): Promise<UserOrmEntity | null>;
  findWithAssociatedRestaurantById(id: string): Promise<UserOrmEntity | null>;
}
