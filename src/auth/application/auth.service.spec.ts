import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from 'src/jwt/jwt.service';
import { UserAuthService } from 'src/user/application/service/user-auth.service';
import { NotFoundException } from '@nestjs/common';
import { LoginInput } from '../interface/dtos/Login.dto';

describe('AuthService', () => {
  let authService: AuthService;

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockUserAuthService = {
    getUserForAuthByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: UserAuthService, useValue: mockUserAuthService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const loginInput: LoginInput = {
      email: 'test@example.com',
      password: 'securePassword',
    };

    it('should throw NotFoundException if user not found', async () => {
      mockUserAuthService.getUserForAuthByEmail.mockResolvedValue(null);

      await expect(authService.login(loginInput)).rejects.toThrow(
        new NotFoundException('User Not Found'),
      );
    });

    it('should return token if login succeeds', async () => {
      const mockUser = {
        id: 'user-id-123',
        checkPassword: jest.fn().mockResolvedValue(true),
      };

      mockUserAuthService.getUserForAuthByEmail.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('signed-token');

      const result = await authService.login(loginInput);

      expect(mockUserAuthService.getUserForAuthByEmail).toHaveBeenCalledWith(
        loginInput.email,
      );
      expect(mockUser.checkPassword).toHaveBeenCalledWith(loginInput.password);
      expect(mockJwtService.sign).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual({ token: 'signed-token' });
    });
  });
});
