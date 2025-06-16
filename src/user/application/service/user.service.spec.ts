import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { BadRequestException } from '@nestjs/common';
import { UserEntity } from '../../domain/user.entity';
import { OwnerEntity } from '../../domain/owner.entity';
import { DriverEntity } from '../../domain/driver.entity';
import { CustomerEntity } from '../../domain/customer.entity';
import {
  CreateOwnerInput,
  CreateCustomerInput,
  CreateDriverInput,
} from '../../interface/dtos/CreateUser.dto';
import { ChangePasswordInput } from '../../interface/dtos/ChangePassword.dto';
import { UserRole } from 'src/constants/userRole';

jest.spyOn(console, 'error').mockImplementation(() => {});

const mockUserCmdRepo = {
  save: jest.fn(),
};
const mockUserQryRepo = {
  findByEmail: jest.fn(),
};
const mockDriverCmdRepo = {
  save: jest.fn(),
};
const mockCustomerCmdRepo = {
  save: jest.fn(),
};
const mockOwnerCmdRepo = {
  save: jest.fn(),
};

jest.mock('../../domain/user.entity');
jest.mock('../../domain/owner.entity');
jest.mock('../../domain/driver.entity');
jest.mock('../../domain/customer.entity');

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: 'IUserCommandRepository', useValue: mockUserCmdRepo },
        { provide: 'IUserQueryRepository', useValue: mockUserQryRepo },
        { provide: 'IDriverCommandRepository', useValue: mockDriverCmdRepo },
        {
          provide: 'ICustomerCommandRepository',
          useValue: mockCustomerCmdRepo,
        },
        { provide: 'IOwnerCommandRepository', useValue: mockOwnerCmdRepo },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  describe('createOwner', () => {
    it('should create owner successfully', async () => {
      mockUserQryRepo.findByEmail.mockResolvedValue(null);
      const input: CreateOwnerInput = {
        email: 'owner@test.com',
        password: 'pwd123',
        role: UserRole.Owner,
      };
      const mockUser = {
        isOwner: jest.fn().mockReturnValue(true),
        id: 'owner-id',
        hashPassword: jest.fn(),
      };
      const mockOwner = {};
      (UserEntity.createNew as jest.Mock).mockReturnValue(mockUser);
      (OwnerEntity.createNew as jest.Mock).mockReturnValue(mockOwner);

      await service.createOwner(input);

      expect(mockUser.hashPassword).toHaveBeenCalled();
      expect(mockUserCmdRepo.save).toHaveBeenCalled();
      expect(mockOwnerCmdRepo.save).toHaveBeenCalled();
    });
  });

  describe('createCustomer', () => {
    it('should create customer successfully', async () => {
      mockUserQryRepo.findByEmail.mockResolvedValue(null);
      const input: CreateCustomerInput = {
        email: 'cust@test.com',
        password: 'pwd123',
        role: UserRole.Client,
        deliveryAddress: 'Addr 123',
      };
      const mockUser = {
        isCustomer: jest.fn().mockReturnValue(true),
        id: 'user-id',
        hashPassword: jest.fn(),
      };
      const mockCustomer = {};
      (UserEntity.createNew as jest.Mock).mockReturnValue(mockUser);
      (CustomerEntity.createNew as jest.Mock).mockReturnValue(mockCustomer);

      await service.createCustomer(input);

      expect(mockUser.hashPassword).toHaveBeenCalled();
      expect(mockUserCmdRepo.save).toHaveBeenCalled();
      expect(mockCustomerCmdRepo.save).toHaveBeenCalled();
    });
  });

  describe('createDriver', () => {
    it('should create driver successfully', async () => {
      mockUserQryRepo.findByEmail.mockResolvedValue(null);
      const input: CreateDriverInput = {
        email: 'driver@test.com',
        password: 'pwd123',
        role: UserRole.Delivery,
      };
      const mockUser = {
        isDriver: jest.fn().mockReturnValue(true),
        id: 'driver-id',
        hashPassword: jest.fn(),
      };
      (UserEntity.createNew as jest.Mock).mockReturnValue(mockUser);
      const mockDriver = {};
      (DriverEntity.createNew as jest.Mock).mockReturnValue(mockDriver);

      await service.createDriver(input);

      expect(mockUser.hashPassword).toHaveBeenCalled();
      expect(mockUserCmdRepo.save).toHaveBeenCalled();
      expect(mockDriverCmdRepo.save).toHaveBeenCalled();
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const user = {
        checkPassword: jest.fn().mockResolvedValue(undefined),
        changePassword: jest.fn(),
        hashPassword: jest.fn(),
      } as any;

      const input: ChangePasswordInput = {
        password: 'oldPass',
        newPassword: 'newPass',
      };

      await service.changePassword(user, input);

      expect(user.checkPassword).toHaveBeenCalledWith('oldPass');
      expect(user.changePassword).toHaveBeenCalledWith('newPass');
      expect(user.hashPassword).toHaveBeenCalled();
      expect(mockUserCmdRepo.save).toHaveBeenCalled();
    });
  });

  describe('validateDuplicateEmail', () => {
    it('should throw BadRequestException if email exists', async () => {
      mockUserQryRepo.findByEmail.mockResolvedValue({});
      await expect(
        service.validateDuplicateEmail('test@test.com'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should succeed if email does not exist', async () => {
      mockUserQryRepo.findByEmail.mockResolvedValue(null);
      await expect(
        service.validateDuplicateEmail('new@test.com'),
      ).resolves.toBeUndefined();
    });
  });

  describe('updateOwner', () => {
    it('should call save on ownerCmdRepo', async () => {
      const mockOwner = {};
      await service.updateOwner(mockOwner as any);
      expect(mockOwnerCmdRepo.save).toHaveBeenCalled();
    });
  });
});
