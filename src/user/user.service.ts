import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CreateCustomerInput,
  CreateDriverInput,
  CreateOwnerInput,
  CreateUserInput,
  CreateUserOutput,
} from './dtos/CreateUser.dto';
import { UserRepository } from './repositories/interfaces/user-repository.interface';
import {
  ChangePasswordInput,
  ChangePasswordOutput,
} from './dtos/ChangePassword.dto';
import { ERROR_MESSAGES } from 'src/constants/errorMessages';
import { UserEntity } from './domain/user.entity';
import { UserMapper } from './mapper/user.mapper';
import { DriverEntity } from './domain/driver.entity';
import { DriverMapper } from './mapper/driver.mapper';
import { OwnerEntity } from './domain/owner.entity';
import { OwnerMapper } from './mapper/owner.mapper';
import { CustomerEntity } from './domain/customer.entity';
import { CustomerMapper } from './mapper/customer.mapper';
import { OwnerRepository } from './repositories/interfaces/owner-repository.interface';
import { DriverRepository } from './repositories/interfaces/driver-repository.interface';
import { CustomerRepository } from './repositories/interfaces/customer-repository.interface';
import { UserOrmEntity } from './orm-entities/user.orm.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('DriverRepository')
    private readonly driverRepository: DriverRepository,
    @Inject('CustomerRepository')
    private readonly customerRepository: CustomerRepository,
    @Inject('OwnerRepository')
    private readonly ownerRepository: OwnerRepository,
  ) {}

  // used
  async createOwner(createOwnerInput: CreateOwnerInput): Promise<void> {
    try {
      await this.validateDuplicateEmail(createOwnerInput.email);

      const user = UserEntity.createNew(
        createOwnerInput.email,
        createOwnerInput.password,
        createOwnerInput.role,
      );

      if (user.isOwner()) {
        await user.hashPassword();
        const owner = OwnerEntity.createNew(user.id);

        await this.userRepository.save(UserMapper.toOrmEntity(user));
        await this.ownerRepository.save(OwnerMapper.toOrmEntity(owner));
      }
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) throw e;
      throw new InternalServerErrorException(
        ERROR_MESSAGES.USER_CREATION_FAILED,
      );
    }
  }

  // used
  async createCustomer(
    createCustomerInput: CreateCustomerInput,
  ): Promise<void> {
    try {
      await this.validateDuplicateEmail(createCustomerInput.email);

      const user = UserEntity.createNew(
        createCustomerInput.email,
        createCustomerInput.password,
        createCustomerInput.role,
      );

      if (user.isCustomer()) {
        await user.hashPassword();
        const customer = CustomerEntity.createNew(
          user.id,
          createCustomerInput.deliveryAddress,
        );

        await this.userRepository.save(UserMapper.toOrmEntity(user));
        await this.customerRepository.save(
          CustomerMapper.toOrmEntity(customer),
        );
      }
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) throw e;
      throw new InternalServerErrorException(
        ERROR_MESSAGES.USER_CREATION_FAILED,
      );
    }
  }

  // used
  async createDriver(createDriverInput: CreateDriverInput): Promise<void> {
    try {
      await this.validateDuplicateEmail(createDriverInput.email);

      const user = UserEntity.createNew(
        createDriverInput.email,
        createDriverInput.password,
        createDriverInput.role,
      );

      if (user.isDriver()) {
        await user.hashPassword();
        const driver = DriverEntity.createNew(user.id);

        await this.userRepository.save(UserMapper.toOrmEntity(user));
        await this.driverRepository.save(DriverMapper.toOrmEntity(driver));
      }
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) throw e;
      throw new InternalServerErrorException(
        ERROR_MESSAGES.USER_CREATION_FAILED,
      );
    }
  }

  // used
  async changePassword(
    user: UserEntity,
    changePasswordInput: ChangePasswordInput,
  ): Promise<void> {
    try {
      await user.checkPassword(changePasswordInput.password);

      user.changePassword(changePasswordInput.newPassword);

      await user.hashPassword();

      await this.userRepository.save(UserMapper.toOrmEntity(user));
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) throw e;
      throw new InternalServerErrorException(
        ERROR_MESSAGES.PASSWORD_CHANGE_FAILED,
      );
    }
  }

  // used
  async validateDuplicateEmail(email: string): Promise<void> {
    try {
      const emailExists = await this.userRepository.findByEmail(email);
      if (emailExists) {
        throw new BadRequestException(ERROR_MESSAGES.DUPLICATE_EMAIL);
      }
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) throw e;
      throw new InternalServerErrorException(
        ERROR_MESSAGES.DUPLICATE_EMAIL_VALIDATION_FAILED,
      );
    }
  }

  // used
  async findUserByEmail(email: string) {
    try {
      const result = await this.userRepository.findByEmail(email);
      if (!result) {
        throw new BadRequestException(ERROR_MESSAGES.USER_NOT_FOUND);
      }
      return result;
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) throw e;
      throw new InternalServerErrorException(ERROR_MESSAGES.FIND_USER_FAILED);
    }
  }

  // used
  async findUserById(id: string): Promise<UserOrmEntity | null> {
    return await this.userRepository.findById(id);
  }

  // used
  async findDriverByUserId(userId: string): Promise<DriverEntity> {
    const driverRecord = await this.driverRepository.findByUserId(userId);

    if (!driverRecord) {
      throw new Error('Driver is not found');
    }

    return DriverMapper.toDomain(driverRecord);
  }

  // used
  async findOwnerByUserId(userId: string): Promise<OwnerEntity> {
    const projection = await this.ownerRepository.findByUserId(userId);

    if (!projection) {
      throw new Error('Owner is not found');
    }

    return OwnerMapper.toDomain(projection);
  }

  // used
  async findCustomerByUserId(userId: string): Promise<CustomerEntity> {
    const customerRecord = await this.customerRepository.findByUserId(userId);

    if (!customerRecord) {
      throw new Error('Customer is not found');
    }

    return CustomerMapper.toDomain(customerRecord);
  }

  // // used
  // async findUserById(id: string): Promise<UserOrmEntity | null> {
  //   try {
  //     return await this.userRepository.findById(id);
  //   } catch (e) {
  //     console.error(e);
  //     throw new InternalServerErrorException(ERROR_MESSAGES.FIND_USER_FAILED);
  //   }
  // }

  // async findUserById(id: string): Promise<UserOrmEntity> {
  //   try {
  //     const userRecord = await this.userRepository.findById(id);
  //     if (!userRecord) {
  //       throw new BadRequestException(ERROR_MESSAGES.USER_NOT_FOUND);
  //     }
  //     return userRecord;
  //   } catch (e) {
  //     console.error(e);
  //     if (e instanceof HttpException) throw e;
  //     throw new InternalServerErrorException(ERROR_MESSAGES.FIND_USER_FAILED);
  //   }
  // }

  // async findUserWithAssociatedRestaurantById(id: string) {
  //   try {
  //     const result =
  //       await this.userRepository.findWithAssociatedRestaurantById(id);
  //     if (!result) {
  //       throw new BadRequestException(ERROR_MESSAGES.USER_NOT_FOUND);
  //     }
  //     return result;
  //   } catch (e) {
  //     console.error(e);
  //     if (e instanceof HttpException) throw e;
  //     throw new InternalServerErrorException(ERROR_MESSAGES.FIND_USER_FAILED);
  //   }
  // }
}
