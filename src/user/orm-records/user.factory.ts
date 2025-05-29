import { UserRole } from 'src/constants/userRole';
import { User } from '../orm-records/user.record';
import { Injectable } from '@nestjs/common';

@Injectable()
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
