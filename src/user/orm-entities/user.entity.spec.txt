import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { ERROR_MESSAGES } from 'src/constants/errorMessages';
import { UserRole } from 'src/constants/userRole';

jest.spyOn(console, 'error').mockImplementation(() => {});
const email = 'email@email.com';
const plainPassword = 'password';

describe('User Entity', () => {
  describe('hashPassword', () => {
    it('should hash password correctly', async () => {
      // given
      const user = new User(email, plainPassword, UserRole.Client);
      const compareSpy = jest.spyOn(bcrypt, 'hash');
      // when
      await user.hashPassword();
      // then
      expect(user.password).not.toBe(plainPassword);
      expect(compareSpy).toHaveBeenCalledWith(plainPassword, 10);
    });

    it('should throw InternalServerErrorException on hashing failure', async () => {
      // given
      const user = new User(email, plainPassword, UserRole.Client);
      (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockRejectedValueOnce(
        new Error('hash fail'),
      );

      // when + then
      await expect(user.hashPassword()).rejects.toThrow(
        ERROR_MESSAGES.HASH_FAILED,
      );
    });
  });

  describe('checkPassword', () => {
    it('should return undefined if password matches', async () => {
      // given

      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      const user = new User(email, hashedPassword, UserRole.Client);
      const compareSpy = jest.spyOn(bcrypt, 'compare');

      // when
      const result = await user.checkPassword(plainPassword);

      // then
      expect(result).toBeUndefined();
      expect(compareSpy).toHaveBeenCalledWith(plainPassword, hashedPassword);
    });

    it('should throw error if password does not match', async () => {
      // given
      const hashedPassword = await bcrypt.hash('wrongPassword', 10);
      const user = new User(email, hashedPassword, UserRole.Client);

      // when + then
      await expect(user.checkPassword(plainPassword)).rejects.toThrow(
        ERROR_MESSAGES.WRONG_PASSWORD,
      );
    });

    it('should throw InternalServerErrorException on comparison failure', async () => {
      // given
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      const user = new User(email, hashedPassword, UserRole.Client);
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockRejectedValueOnce(
        new Error('compare fail'),
      );

      // when + then
      await expect(user.checkPassword(plainPassword)).rejects.toThrow(
        ERROR_MESSAGES.PASSWORD_CHECK_FAILED,
      );
    });
  });
});
