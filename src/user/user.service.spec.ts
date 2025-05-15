import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { MemoryUserRepository } from './repositories/memory-user.repository';
import { UserRole } from 'src/constants/userRole';
import { InternalServerErrorException } from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/constants/errorMessages';
import * as bcrypt from 'bcrypt';
import { UserFactory } from './domain/user.factory';

jest.spyOn(console, 'error').mockImplementation(() => {});

describe('UserService', () => {
  let module: TestingModule;
  let service: UserService;
  let userRepository: MemoryUserRepository;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        UserService,
        UserFactory,
        { provide: 'UserRepository', useClass: MemoryUserRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<MemoryUserRepository>('UserRepository');
  });

  afterEach(() => {
    // userRepository.show();
    userRepository.clear();
  });

  describe('createUser', () => {
    it('should return id, email, and role when createUser is called', async () => {
      // when
      const result = await service.createUser({
        email: 'test@example.com',
        password: 'password',
        role: UserRole.Client,
      });

      // then
      expect(result).toEqual({
        id: result.id,
        email: 'test@example.com',
        role: UserRole.Client,
      });
    });

    it('should throw an error if email already exists', async () => {
      // given
      await service.createUser({
        email: 'test@example.com',
        password: 'password',
        role: UserRole.Client,
      });

      // when + then
      await expect(
        service.createUser({
          email: 'test@example.com',
          password: 'newpassword123',
          role: UserRole.Client,
        }),
      ).rejects.toThrow(ERROR_MESSAGES.DUPLICATE_EMAIL);
    });

    it('should throw an error when hashing password fails', async () => {
      // given
      (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockRejectedValueOnce(
        new Error('hash fail'),
      );

      // when + then
      await expect(
        service.createUser({
          email: 'test@example.com',
          password: 'password',
          role: UserRole.Client,
        }),
      ).rejects.toThrow(ERROR_MESSAGES.HASH_FAILED);
    });

    it('should throw an error if repository fails', async () => {
      // given
      jest
        .spyOn(service['userRepository'], 'save')
        .mockRejectedValueOnce(new Error('DB error'));

      // when + then
      await expect(
        service.createUser({
          email: 'fail@example.com',
          password: 'password',
          role: UserRole.Client,
        }),
      ).rejects.toThrow(ERROR_MESSAGES.USER_CREATION_FAILED);
    });
  });

  describe('validateDuplicateEmail', () => {
    it('should not throw when there is not duplicate email', async () => {
      // given
      jest
        .spyOn(service['userRepository'], 'findByEmail')
        .mockResolvedValue(null);
      // when
      const result = await service.validateDuplicateEmail('email@email.com');
      // then
      expect(result).toBeUndefined();
    });

    it('should throw when there is duplicate email', async () => {
      // given
      await service.createUser({
        email: 'test@example.com',
        password: 'password',
        role: UserRole.Client,
      });
      // when + then
      await expect(
        service.validateDuplicateEmail('test@example.com'),
      ).rejects.toThrow(ERROR_MESSAGES.DUPLICATE_EMAIL);
    });
  });

  describe('findUserByEmail', () => {
    it('should return user when findUserByEmail is called', async () => {
      // given
      await service.createUser({
        email: 'test@example.com',
        password: 'password',
        role: UserRole.Client,
      });
      // when
      const result = await service.findUserByEmail('test@example.com');
      // then
      expect(result.email).toBe('test@example.com');
    });

    it('should throw if user is not found', async () => {
      // when + then
      await expect(
        service.findUserByEmail('notfound@example.com'),
      ).rejects.toThrow(ERROR_MESSAGES.USER_NOT_FOUND);
    });
  });

  describe('changePassword', () => {
    it('should return id, email, and userRole when changePassword is called', async () => {
      // given
      await service.createUser({
        email: 'test@example.com',
        password: 'password',
        role: UserRole.Client,
      });
      const user = await service.findUserByEmail('test@example.com');

      // when
      const result = await service.changePassword(user, {
        password: 'password',
        newPassword: 'newPassword',
      });
      // then
      expect(result.email).toBe('test@example.com');
      expect(result.role).toBe(UserRole.Client);
    });

    it('should throw an error when provided original password is incorrect', async () => {
      // given
      await service.createUser({
        email: 'test@example.com',
        password: 'password',
        role: UserRole.Client,
      });
      const user = await service.findUserByEmail('test@example.com');
      // when + then
      await expect(
        service.changePassword(user, {
          password: 'wrongPassword123',
          newPassword: 'newPassword123',
        }),
      ).rejects.toThrow(ERROR_MESSAGES.WRONG_PASSWORD);
    });

    it('should throw an error when hashing password fails', async () => {
      // given
      await service.createUser({
        email: 'test@example.com',
        password: 'password',
        role: UserRole.Client,
      });
      const user = await service.findUserByEmail('test@example.com');
      jest
        .spyOn(user, 'hashPassword')
        .mockRejectedValue(
          new InternalServerErrorException(ERROR_MESSAGES.HASH_FAILED),
        );
      // when + then
      await expect(
        service.changePassword(user, {
          password: 'password',
          newPassword: 'newPassword123',
        }),
      ).rejects.toThrow(ERROR_MESSAGES.HASH_FAILED);
    });

    it('should throw an error when userRepository fails', async () => {
      // given
      await service.createUser({
        email: 'test@example.com',
        password: 'password',
        role: UserRole.Client,
      });
      const user = await service.findUserByEmail('test@example.com');
      jest
        .spyOn(service['userRepository'], 'save')
        .mockRejectedValue('DB fails');
      // when + then
      await expect(
        service.changePassword(user, {
          password: 'password',
          newPassword: 'newPassword123',
        }),
      ).rejects.toThrow(ERROR_MESSAGES.PASSWORD_CHANGE_FAILED);
    });
  });

  describe('findUserById', () => {
    it('should return user when findUserById is called', async () => {
      // given
      await service.createUser({
        email: 'test@example.com',
        password: 'password',
        role: UserRole.Client,
      });
      const { id: userId } = await service.findUserByEmail('test@example.com');

      // when
      const result = await service.findUserById(userId);

      // then
      expect(result.id).toBe(userId);
    });

    it('should throw if user is not found', async () => {
      // when + then
      await expect(service.findUserById('notfoundid')).rejects.toThrow(
        ERROR_MESSAGES.USER_NOT_FOUND,
      );
    });

    it('should throw an error when userRepository fails', async () => {
      // given
      jest
        .spyOn(userRepository, 'findById')
        .mockRejectedValue(new Error('DB error'));
      // when + then
      await expect(service.findUserById('someId')).rejects.toThrow(
        ERROR_MESSAGES.FIND_USER_FAILED,
      );
    });
  });
});
