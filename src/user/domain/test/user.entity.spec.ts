import { UserRole } from 'src/constants/userRole';
import { UserEntity } from '../user.entity';
import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

jest.spyOn(console, 'error').mockImplementation(() => {});

describe('User Entity', () => {
  const email = 'test@test.com';
  const rawPassword = 'test';
  const role = UserRole.Owner;

  describe('createNew', () => {
    const user = UserEntity.createNew(email, rawPassword, role);
    expect(user.id).toBeDefined();
    expect(user.email).toBe(email);
    expect(user.password).toBe(rawPassword);
    expect(user.role).toBe(role);
  });

  describe('fromPersistance', () => {
    it('should create an UserEntity with all values from persistence', () => {
      const id = uuidv4();
      const user = UserEntity.fromPersistance(id, email, rawPassword, role);
      expect(user.id).toBe(id);
      expect(user.email).toBe(email);
      expect(user.password).toBe(rawPassword);
      expect(user.role).toBe(role);
    });
  });

  describe('isRole checks', () => {
    it('should return true if user is owner', () => {
      const user = UserEntity.createNew(email, rawPassword, UserRole.Owner);
      expect(user.isOwner()).toBe(true);
    });

    it('should return true if user is customer', () => {
      const user = UserEntity.createNew(email, rawPassword, UserRole.Client);
      expect(user.isCustomer()).toBe(true);
    });

    it('should return true if user is driver', () => {
      const user = UserEntity.createNew(email, rawPassword, UserRole.Delivery);
      expect(user.isDriver()).toBe(true);
    });
  });

  describe('hashPassword', () => {
    it('should hash the password correctly', async () => {
      const user = UserEntity.createNew(email, rawPassword, role);
      await user.hashPassword();
      expect(user.password).not.toBe(rawPassword);
      const match = await bcrypt.compare(rawPassword, user.password);
      expect(match).toBe(true);
    });

    it('should throw InternalServerErrorException on bcrypt failure', async () => {
      const user = UserEntity.createNew(email, rawPassword, role);
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
        throw new Error('bcrypt failed');
      });

      await expect(user.hashPassword()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('checkPassword', () => {
    it('should not throw if password matches', async () => {
      const user = UserEntity.createNew(email, rawPassword, role);
      await user.hashPassword();
      await expect(user.checkPassword(rawPassword)).resolves.not.toThrow();
    });

    it('should throw BadRequestException if password does not match', async () => {
      const user = UserEntity.createNew(email, rawPassword, role);
      await user.hashPassword();
      await expect(user.checkPassword('wrong-password')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException on bcrypt failure', async () => {
      const user = UserEntity.createNew(email, rawPassword, role);
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
        throw new Error('bcrypt failed');
      });

      await expect(user.checkPassword(rawPassword)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('changePassword', () => {
    it('should update the password', () => {
      const user = UserEntity.createNew(email, rawPassword, role);
      user.changePassword('newPassword');
      expect(user.password).toBe('newPassword');
    });
  });

  describe('checkUserRole', () => {
    it('should not throw if role matches', () => {
      const user = UserEntity.createNew(email, rawPassword, UserRole.Owner);
      expect(() => user.checkUserRole(UserRole.Owner)).not.toThrow();
    });

    it('should throw BadRequestException if role does not match', () => {
      const user = UserEntity.createNew(email, rawPassword, UserRole.Client);
      expect(() => user.checkUserRole(UserRole.Owner)).toThrow(
        BadRequestException,
      );
    });
  });
});

// // import { User } from './user.entity';
// import * as bcrypt from 'bcrypt';
// import { ERROR_MESSAGES } from 'src/constants/errorMessages';
// import { UserRole } from 'src/constants/userRole';

// // jest.spyOn(console, 'error').mockImplementation(() => {});
// const email = 'email@email.com';
// const plainPassword = 'password';

// describe('User Entity', () => {
//   describe('hashPassword', () => {
//     it('should hash password correctly', async () => {
//       // given
//       const user = new User(email, plainPassword, UserRole.Client);
//       const compareSpy = jest.spyOn(bcrypt, 'hash');
//       // when
//       await user.hashPassword();
//       // then
//       expect(user.password).not.toBe(plainPassword);
//       expect(compareSpy).toHaveBeenCalledWith(plainPassword, 10);
//     });

//     it('should throw InternalServerErrorException on hashing failure', async () => {
//       // given
//       const user = new User(email, plainPassword, UserRole.Client);
//       (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockRejectedValueOnce(
//         new Error('hash fail'),
//       );

//       // when + then
//       await expect(user.hashPassword()).rejects.toThrow(
//         ERROR_MESSAGES.HASH_FAILED,
//       );
//     });
//   });

//   describe('checkPassword', () => {
//     it('should return undefined if password matches', async () => {
//       // given

//       const hashedPassword = await bcrypt.hash(plainPassword, 10);
//       const user = new User(email, hashedPassword, UserRole.Client);
//       const compareSpy = jest.spyOn(bcrypt, 'compare');

//       // when
//       const result = await user.checkPassword(plainPassword);

//       // then
//       expect(result).toBeUndefined();
//       expect(compareSpy).toHaveBeenCalledWith(plainPassword, hashedPassword);
//     });

//     it('should throw error if password does not match', async () => {
//       // given
//       const hashedPassword = await bcrypt.hash('wrongPassword', 10);
//       const user = new User(email, hashedPassword, UserRole.Client);

//       // when + then
//       await expect(user.checkPassword(plainPassword)).rejects.toThrow(
//         ERROR_MESSAGES.WRONG_PASSWORD,
//       );
//     });

//     it('should throw InternalServerErrorException on comparison failure', async () => {
//       // given
//       const hashedPassword = await bcrypt.hash(plainPassword, 10);
//       const user = new User(email, hashedPassword, UserRole.Client);
//       (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockRejectedValueOnce(
//         new Error('compare fail'),
//       );

//       // when + then
//       await expect(user.checkPassword(plainPassword)).rejects.toThrow(
//         ERROR_MESSAGES.PASSWORD_CHECK_FAILED,
//       );
//     });
//   });
// });
