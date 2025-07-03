import { Inject, Injectable } from '@nestjs/common';
import {
  CreateClientInput,
  CreateDriverInput,
  CreateOwnerInput,
} from '../../interface/dtos/create-user.dto';
import { ChangePasswordInput } from '../../interface/dtos/change-password.dto';
import { UserEntity } from '../../domain/user.entity';
import { DriverEntity } from '../../domain/driver.entity';
import { OwnerEntity } from '../../domain/owner.entity';
import { ClientEntity } from '../../domain/client.entity';
import { IUserCommandRepository } from 'src/user/infrastructure/repositories/command/user/user-command.repository.interface';

import { UserInternalService } from './user.internal.service';
import { UserRole } from 'src/constants/userRole';
import { UserMapper } from '../mapper/user.mapper';
import { OwnerMapper } from '../mapper/owner.mapper';
import { ClientMapper } from '../mapper/client.mapper';
import { DriverMapper } from '../mapper/driver.mapper';
import { IDriverCommandRepository } from 'src/user/infrastructure/repositories/command/driver/driver-command.repository.interface';
import { IClientCommandRepository } from 'src/user/infrastructure/repositories/command/client/client-command.repository.interface';
import { IOwnerCommandRepository } from 'src/user/infrastructure/repositories/command/owner/owner-command.repository.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserCommandRepository')
    private readonly userCmdRepo: IUserCommandRepository,
    @Inject('IDriverCommandRepository')
    private readonly driverCmdRepo: IDriverCommandRepository,
    @Inject('IClientCommandRepository')
    private readonly clientCmdRepo: IClientCommandRepository,
    @Inject('IOwnerCommandRepository')
    private readonly ownerCmdRepo: IOwnerCommandRepository,
    private readonly userInternalService: UserInternalService,
  ) {}

  async createOwner({ email, password }: CreateOwnerInput): Promise<void> {
    await this.userInternalService._validateDuplicateEmail(email);

    const user = UserEntity.createNew(email, password, UserRole.Owner);
    await user.hashPassword();

    const owner = OwnerEntity.createNew(user.id);

    await this.userCmdRepo.save(UserMapper.toOrmEntity(user));
    await this.ownerCmdRepo.save(OwnerMapper.toOrmEntity(owner));
  }

  async createClient({
    email,
    password,
    deliveryAddress,
  }: CreateClientInput): Promise<void> {
    await this.userInternalService._validateDuplicateEmail(email);

    const user = UserEntity.createNew(email, password, UserRole.Client);
    await user.hashPassword();

    const client = ClientEntity.createNew(user.id, deliveryAddress);

    await this.userCmdRepo.save(UserMapper.toOrmEntity(user));
    await this.clientCmdRepo.save(ClientMapper.toOrmEntity(client));
  }

  async createDriver({ email, password }: CreateDriverInput): Promise<void> {
    await this.userInternalService._validateDuplicateEmail(email);

    const user = UserEntity.createNew(email, password, UserRole.Driver);
    await user.hashPassword();

    const driver = DriverEntity.createNew(user.id);

    await this.userCmdRepo.save(UserMapper.toOrmEntity(user));
    await this.driverCmdRepo.save(DriverMapper.toOrmEntity(driver));
  }

  async changePassword(
    user: UserEntity,
    { password, newPassword }: ChangePasswordInput,
  ): Promise<void> {
    await user.checkPassword(password);

    user.changePassword(newPassword);
    await user.hashPassword();

    await this.userCmdRepo.save(UserMapper.toOrmEntity(user));
  }
}
