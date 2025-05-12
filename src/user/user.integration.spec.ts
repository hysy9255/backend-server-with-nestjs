import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { MemoryUserRepository } from './repositories/memory-user.repository';
import { JwtService } from 'src/jwt/jwt.service';
import { JwtModule } from 'src/jwt/jwt.module';
import { UserModule } from './user.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserRole } from 'src/constants/userRole';
import { ConfigModule } from '@nestjs/config';

describe('Integration Test (Real JwtService)', () => {
  let module: TestingModule;
  let userService: UserService;
  let authService: AuthService;
  let jwtService: JwtService;
  let userRepository: MemoryUserRepository;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        UserModule,
        AuthModule,
        JwtModule,
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath:
            process.env.NODE_ENV === 'test.local'
              ? '.env.test.local'
              : '.env.development.local',
        }),
      ],
    })
      .overrideProvider('UserRepository')
      .useClass(MemoryUserRepository)
      .compile();

    userService = module.get(UserService);
    authService = module.get(AuthService);
    jwtService = module.get(JwtService);
    userRepository = module.get<MemoryUserRepository>('UserRepository');
  });

  afterEach(() => {
    // userRepository.show();
    userRepository.clear();
  });

  it('should allow login with new password after changing it', async () => {
    // 1. Create user
    await userService.createUser({
      email: 'test@example.com',
      password: 'originalPassword',
      role: UserRole.Client,
    });

    // 2. Find user and change password
    const user = await userService.findUserByEmail('test@example.com');
    await userService.changePassword(user, {
      password: 'originalPassword',
      newPassword: 'newSecurePassword',
    });

    // 3. Login with new password
    const loginResult = await authService.login({
      email: 'test@example.com',
      password: 'newSecurePassword',
    });

    // 4. Expect token to be returned
    expect(loginResult).toHaveProperty('token');
    const payload = jwtService.verify(loginResult.token);
    expect(payload).toHaveProperty('id', user.id);
  });
});
