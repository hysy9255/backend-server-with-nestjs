import { UserRecord } from '../../orm-records/user.record';

export interface UserRepository {
  save(user: UserRecord): Promise<UserRecord>;
  findByEmail(email: string): Promise<UserRecord | null>;
  findById(id: string): Promise<UserRecord | null>;
  findWithAssociatedRestaurantById(id: string): Promise<UserRecord | null>;
}
