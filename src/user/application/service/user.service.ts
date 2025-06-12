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
} from '../../interface/dtos/CreateUser.dto';
import { IUserCommandRepository } from '../command/repositories/user-command.repository.interface';
import { ChangePasswordInput } from '../../interface/dtos/ChangePassword.dto';
import { ERROR_MESSAGES } from 'src/constants/errorMessages';
import { UserEntity } from '../../domain/user.entity';
import { UserMapper } from './mapper/user.mapper';
import { DriverEntity } from '../../domain/driver.entity';
import { DriverMapper } from './mapper/driver.mapper';
import { OwnerEntity } from '../../domain/owner.entity';
import { OwnerMapper } from './mapper/owner.mapper';
import { CustomerEntity } from '../../domain/customer.entity';
import { CustomerMapper } from './mapper/customer.mapper';
import { IOwnerCommandRepository } from '../command/repositories/owner-command.repository.interface';
import { IUserQueryRepository } from '../query/repositories/user-query.repository.interface';
import { UserSummaryProjection } from '../query/projections/user.projection';
import { ICustomerCommandRepository } from '../command/repositories/customer-command.repository.interface';
import { IDriverCommandRepository } from '../command/repositories/driver-command.repository.interface';
import { UserProjection } from '../command/projections/user.projection';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserQueryRepository')
    private readonly userQryRepo: IUserQueryRepository,
    @Inject('IUserCommandRepository')
    private readonly userCmdRepo: IUserCommandRepository,
    @Inject('IDriverCommandRepository')
    private readonly driverCmdRepo: IDriverCommandRepository,
    @Inject('ICustomerCommandRepository')
    private readonly customerCmdRepo: ICustomerCommandRepository,
    @Inject('IOwnerCommandRepository')
    private readonly ownerCmdRepo: IOwnerCommandRepository,
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

        await this.userCmdRepo.save(UserMapper.toOrmEntity(user));
        await this.ownerCmdRepo.save(OwnerMapper.toOrmEntity(owner));
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

        await this.userCmdRepo.save(UserMapper.toOrmEntity(user));
        await this.customerCmdRepo.save(CustomerMapper.toOrmEntity(customer));
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

        await this.userCmdRepo.save(UserMapper.toOrmEntity(user));
        await this.driverCmdRepo.save(DriverMapper.toOrmEntity(driver));
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

      await this.userCmdRepo.save(UserMapper.toOrmEntity(user));
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
      const emailExists = await this.userQryRepo.findByEmail(email);
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
  async findUserByEmail(email: string): Promise<UserProjection> {
    try {
      const result = await this.userCmdRepo.findByEmail(email);
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
  async findUserById(id: string): Promise<UserSummaryProjection | null> {
    return await this.userQryRepo.findById(id);
  }

  async findUserByUserId(userId: string): Promise<UserEntity> {
    const projection = await this.userCmdRepo.findByUserId(userId);

    if (!projection) {
      throw new Error('User is not found');
    }

    return UserMapper.toDomain(projection);
  }

  // used
  async findDriverByUserId(userId: string): Promise<DriverEntity> {
    const projection = await this.driverCmdRepo.findByUserId(userId);

    if (!projection) {
      throw new Error('Driver is not found');
    }

    return DriverMapper.toDomain(projection);
  }

  // used
  async findOwnerByUserId(userId: string): Promise<OwnerEntity> {
    const projection = await this.ownerCmdRepo.findByUserId(userId);

    if (!projection) {
      throw new Error('Owner is not found');
    }

    return OwnerMapper.toDomain(projection);
  }

  // used
  async findCustomerByUserId(userId: string): Promise<CustomerEntity> {
    const projection = await this.customerCmdRepo.findByUserId(userId);

    if (!projection) {
      throw new Error('Customer is not found');
    }

    return CustomerMapper.toDomain(projection);
  }

  async updateOwner(owner: OwnerEntity): Promise<void> {
    await this.ownerCmdRepo.save(OwnerMapper.toOrmEntity(owner));
  }
}
