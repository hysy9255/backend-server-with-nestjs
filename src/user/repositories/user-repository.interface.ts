// src/modules/user/repositories/user-repository.interface.ts

import { User } from '../orm-records/user.record';

export interface UserRepository {
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findWithAssociatedRestaurantById(id: string): Promise<User | null>;
}
