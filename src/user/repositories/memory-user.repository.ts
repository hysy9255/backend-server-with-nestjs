// src/modules/user/repositories/memory-user.repository.ts
import { UserRepository } from './user-repository.interface';
import { CreateUserInput } from '../dtos/CreateUser.dto';
import { User } from '../domain/user.entity';

export class MemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async save(createUserInput: CreateUserInput): Promise<User> {
    const newUser = new User(
      createUserInput.email,
      createUserInput.password,
      createUserInput.role,
    );

    this.users.push(newUser);
    return newUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);
    return user || null;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id);
    return user || null;
  }

  show() {
    console.log(this.users);
  }

  clear() {
    this.users = []; // 저장된 유저 리스트를 비워줌
  }
}
