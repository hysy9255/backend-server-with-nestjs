import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from './jwt.service';
import * as jwt from 'jsonwebtoken';
import { ConfigModule, ConfigService } from '@nestjs/config';

jest.spyOn(console, 'error').mockImplementation(() => {});

const id = '1';
const token = 'token';

describe('JwtService', () => {
  let module: TestingModule;
  let service: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.development.local',
        }),
      ],
      providers: [JwtService],
    }).compile();

    service = module.get<JwtService>(JwtService);
    configService = module.get(ConfigService);
  });

  describe('sign', () => {
    it('should return a signed token', () => {
      // given
      const key = configService.get<string>('JWT_PRIVATE_KEY');
      (jest.spyOn(jwt, 'sign') as jest.Mock).mockReturnValue(token);
      // when
      const result = service.sign(id);
      // then
      // expect(jwt.sign).toHaveBeenCalledWith({ id }, 'this.options.privateKey');
      expect(jwt.sign).toHaveBeenCalledWith({ id }, key);
      expect(result).toBe(token);
    });
  });

  describe('verify', () => {
    it('should return the decoded token if valid', () => {
      // given
      const key = configService.get<string>('JWT_PRIVATE_KEY');
      const decoded = { id };
      (jest.spyOn(jwt, 'verify') as jest.Mock).mockReturnValue(decoded);

      // when
      const result = service.verify(token);

      // then
      // expect(jwt.verify).toHaveBeenCalledWith(token, 'this.options.privateKey');
      expect(jwt.verify).toHaveBeenCalledWith(token, key);
      expect(result).toEqual(decoded);
    });
  });
});
