import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './application/auth.service';
import { JwtService } from 'src/jwt/jwt.service';
import { UserService } from 'src/user/application/service/user.service';
import { ERROR_MESSAGES } from 'src/constants/errorMessages';

jest.spyOn(console, 'error').mockImplementation(() => {});

const mockJwtService = {
  sign: jest.fn((id: string) => `token-${id}`),
};
const mockUserService = {
  findUserByEmail: jest.fn(),
};

const id = '1';
const email = 'hello@example.com';
const password = 'password123';

describe('AuthService', () => {
  let module: TestingModule;
  let service: AuthService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return token when login is successful', async () => {
      // given
      const mockUser = {
        id,
        email,
        checkPassword: jest.fn().mockResolvedValue(undefined),
      };

      mockUserService.findUserByEmail.mockResolvedValue(mockUser);

      // when
      const result = await service.login({ email, password });

      // then
      expect(result).toHaveProperty('token');
      expect(result.token).toBe('token-1');
      expect(mockUserService.findUserByEmail).toHaveBeenCalledWith(email);
      expect(mockUser.checkPassword).toHaveBeenCalledWith(password);
      expect(mockJwtService.sign).toHaveBeenCalledWith(id);
    });

    it('should throw if userService.findUserByEmail fails', async () => {
      // given
      mockUserService.findUserByEmail.mockRejectedValue(new Error('DB error'));

      // when + then
      await expect(service.login({ email, password })).rejects.toThrow(
        ERROR_MESSAGES.LOG_IN_FAILED,
      );
    });
  });
});
