import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  CreateCustomerInput,
  CreateDriverInput,
  CreateOwnerInput,
} from '../../interface/dtos/CreateUser.dto';
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
import { IUserQueryRepository } from '../../infrastructure/repositories/query/user-query.repository.interface';
import { IUserCommandRepository } from 'src/user/infrastructure/repositories/command/user-command.repository.interface';
import { IDriverCommandRepository } from 'src/user/infrastructure/repositories/command/driver-command.repository.interface';
import { ICustomerCommandRepository } from 'src/user/infrastructure/repositories/command/customer-command.repository.interface';
import { IOwnerCommandRepository } from 'src/user/infrastructure/repositories/command/owner-command.repository.interface';

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
  }

  // used
  async createCustomer(
    createCustomerInput: CreateCustomerInput,
  ): Promise<void> {
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
  }

  // used
  async createDriver(createDriverInput: CreateDriverInput): Promise<void> {
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
  }

  // used
  async changePassword(
    user: UserEntity,
    changePasswordInput: ChangePasswordInput,
  ): Promise<void> {
    await user.checkPassword(changePasswordInput.password);

    user.changePassword(changePasswordInput.newPassword);

    await user.hashPassword();

    await this.userCmdRepo.save(UserMapper.toOrmEntity(user));
  }

  // used
  async validateDuplicateEmail(email: string): Promise<void> {
    const emailExists = await this.userQryRepo.findByEmail(email);
    if (emailExists) {
      throw new BadRequestException(ERROR_MESSAGES.DUPLICATE_EMAIL);
    }
  }

  async updateOwner(owner: OwnerEntity): Promise<void> {
    await this.ownerCmdRepo.save(OwnerMapper.toOrmEntity(owner));
  }
}
