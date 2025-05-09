import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from './jwt.service';
import * as jwt from 'jsonwebtoken';

jest.spyOn(console, 'error').mockImplementation(() => {});

const id = '1';
const token = 'token';

describe('JwtService', () => {
  let module: TestingModule;
  let service: JwtService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [JwtService],
    }).compile();

    service = module.get<JwtService>(JwtService);
  });

  describe('sign', () => {
    it('should return a signed token', () => {
      // given
      (jest.spyOn(jwt, 'sign') as jest.Mock).mockReturnValue(token);
      // when
      const result = service.sign(id);
      // then
      expect(jwt.sign).toHaveBeenCalledWith({ id }, 'this.options.privateKey');
      expect(result).toBe(token);
    });
  });

  describe('verify', () => {
    it('should return the decoded token if valid', () => {
      // given
      const decoded = { id };
      (jest.spyOn(jwt, 'verify') as jest.Mock).mockReturnValue(decoded);

      // when
      const result = service.verify(token);

      // then
      expect(jwt.verify).toHaveBeenCalledWith(token, 'this.options.privateKey');
      expect(result).toEqual(decoded);
    });
  });
});
