import { UserRole } from 'src/constants/userRole';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

export class UserFactory {
  async createNewUser(
    email: string,
    password: string,
    role: UserRole,
  ): Promise<User> {
    const user = new User(email, password, role);
    await user.hashPassword();
    return user;
  }
}
