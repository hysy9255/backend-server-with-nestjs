import { Test, TestingModule } from '@nestjs/testing';
import { UserAuthService } from '../user.auth.service';

jest.mock('../../domain/user.entity');
jest.mock('../../domain/driver.entity');
jest.mock('../../domain/owner.entity');
jest.mock('../../domain/customer.entity');
jest.mock('./mapper/user.mapper', () => ({
  UserMapper: { toDomain: jest.fn() },
}));
jest.mock('./mapper/driver.mapper', () => ({
  DriverMapper: { toDomain: jest.fn() },
}));
jest.mock('./mapper/owner.mapper', () => ({
  OwnerMapper: { toDomain: jest.fn() },
}));
jest.mock('./mapper/customer.mapper', () => ({
  CustomerMapper: { toDomain: jest.fn() },
}));

describe('UserAuthService', () => {
  let service: UserAuthService;
  const mockUserQryRepo = { findById: jest.fn() };
  const mockUserCmdRepo = {
    findByEmail: jest.fn(),
    findByUserId: jest.fn(),
  };
  const mockDriverCmdRepo = { findByUserId: jest.fn() };
  const mockOwnerCmdRepo = { findByUserId: jest.fn() };
  const mockCustomerCmdRepo = { findByUserId: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserAuthService,
        { provide: 'IUserQueryRepository', useValue: mockUserQryRepo },
        { provide: 'IUserCommandRepository', useValue: mockUserCmdRepo },
        { provide: 'IDriverCommandRepository', useValue: mockDriverCmdRepo },
        {
          provide: 'ICustomerCommandRepository',
          useValue: mockCustomerCmdRepo,
        },
        { provide: 'IOwnerCommandRepository', useValue: mockOwnerCmdRepo },
      ],
    }).compile();

    service = module.get<UserAuthService>(UserAuthService);
  });

  describe('findUserForMiddlewareById', () => {
    it('should return user projection by ID', async () => {
      const projection = { id: '123' };
      mockUserQryRepo.findById.mockResolvedValue(projection);
      const result = await service.findUserForMiddlewareById('123');
      expect(result).toEqual(projection);
    });
  });

  describe('getUserForAuthByEmail', () => {
    it('should return user entity for auth by email', async () => {
      const projection = { id: '123' };
      const domain = {};
      mockUserCmdRepo.findByEmail.mockResolvedValue(projection);
      const { UserMapper } = require('./mapper/user.mapper');
      UserMapper.toDomain.mockReturnValue(domain);
      const result = await service.getUserForAuthByEmail('test@example.com');
      expect(result).toEqual(domain);
    });

    it('should return null when user not found by email', async () => {
      mockUserCmdRepo.findByEmail.mockResolvedValue(null);
      const result = await service.getUserForAuthByEmail(
        'notfound@example.com',
      );
      expect(result).toBeNull();
    });
  });

  describe('getUserForAuth', () => {
    it('should return user entity for auth by userId', async () => {
      const projection = { id: '123' };
      const domain = {};
      mockUserCmdRepo.findByUserId.mockResolvedValue(projection);
      const { UserMapper } = require('./mapper/user.mapper');
      UserMapper.toDomain.mockReturnValue(domain);
      const result = await service.getUserForAuth('123');
      expect(result).toEqual(domain);
    });

    it('should return null when user not found by userId', async () => {
      mockUserCmdRepo.findByUserId.mockResolvedValue(null);
      const result = await service.getUserForAuth('notfound');
      expect(result).toBeNull();
    });
  });

  describe('getDriverForAuth', () => {
    it('should return driver entity for auth', async () => {
      const projection = { userId: '123' };
      const domain = {};
      mockDriverCmdRepo.findByUserId.mockResolvedValue(projection);
      const { DriverMapper } = require('./mapper/driver.mapper');
      DriverMapper.toDomain.mockReturnValue(domain);
      const result = await service.getDriverForAuth('123');
      expect(result).toEqual(domain);
    });

    it('should return null when driver not found by userId', async () => {
      mockDriverCmdRepo.findByUserId.mockResolvedValue(null);
      const result = await service.getDriverForAuth('notfound');
      expect(result).toBeNull();
    });
  });

  describe('getOwnerForAuth', () => {
    it('should return owner entity for auth', async () => {
      const projection = { userId: '123' };
      const domain = {};
      mockOwnerCmdRepo.findByUserId.mockResolvedValue(projection);
      const { OwnerMapper } = require('./mapper/owner.mapper');
      OwnerMapper.toDomain.mockReturnValue(domain);
      const result = await service.getOwnerForAuth('123');
      expect(result).toEqual(domain);
    });

    it('should return null when owner not found by userId', async () => {
      mockOwnerCmdRepo.findByUserId.mockResolvedValue(null);
      const result = await service.getOwnerForAuth('notfound');
      expect(result).toBeNull();
    });
  });

  describe('getCustomerForAuth', () => {
    it('should return customer entity for auth', async () => {
      const projection = { userId: '123' };
      const domain = {};
      mockCustomerCmdRepo.findByUserId.mockResolvedValue(projection);
      const { CustomerMapper } = require('./mapper/customer.mapper');
      CustomerMapper.toDomain.mockReturnValue(domain);
      const result = await service.getCustomerForAuth('123');
      expect(result).toEqual(domain);
    });

    it('should return null when customer not found by userId', async () => {
      mockCustomerCmdRepo.findByUserId.mockResolvedValue(null);
      const result = await service.getCustomerForAuth('notfound');
      expect(result).toBeNull();
    });
  });
});
