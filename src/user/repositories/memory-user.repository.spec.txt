import { MemoryUserRepository } from './memory-user.repository'; // 구현체 import
import { CreateUserInput } from '../dtos/CreateUser.dto';
import { UserRole } from 'src/constants/userRole';

describe('MemoryUserRepository', () => {
  let repository: MemoryUserRepository;

  const input: CreateUserInput = {
    email: 'test@example.com',
    password: 'password123',
    role: UserRole.Client,
  };

  beforeEach(() => {
    repository = new MemoryUserRepository();
  });

  afterEach(() => {
    repository.clear();
  });

  describe('save', () => {
    it('should save a user and return the saved user', async () => {
      // when
      const user = await repository.save(input);

      //then
      expect(user).toHaveProperty('id');
      expect(user.email).toBe(input.email);
    });
  });

  describe('findByEmail', () => {
    it('should return user if email exists', async () => {
      // given
      await repository.save(input);

      // when
      const foundUser = await repository.findByEmail('test@example.com');

      // then
      expect(foundUser).not.toBeNull();
      expect(foundUser?.email).toBe('test@example.com');
    });

    it('should return null if email does not exist', async () => {
      // when
      const foundUser = await repository.findByEmail('nonexistent@example.com');
      // then
      expect(foundUser).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return user if id exists', async () => {
      // given
      const savedUser = await repository.save(input);

      // when
      const foundUser = await repository.findById(savedUser.id);

      // then
      expect(foundUser).not.toBeNull();
      expect(foundUser?.id).toBe(savedUser.id);
    });

    it('should return null if id does not exist', async () => {
      // when
      const foundUser = await repository.findById('nonexistent-id');

      // then
      expect(foundUser).toBeNull();
    });
  });
});
