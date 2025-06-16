import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from '../../domain/user.entity';
import { UserMapper } from './mapper/user.mapper';
import { DriverEntity } from '../../domain/driver.entity';
import { DriverMapper } from './mapper/driver.mapper';
import { OwnerEntity } from '../../domain/owner.entity';
import { OwnerMapper } from './mapper/owner.mapper';
import { CustomerEntity } from '../../domain/customer.entity';
import { CustomerMapper } from './mapper/customer.mapper';
import {
  IUserQueryRepository,
  UserQueryProjection,
} from '../../infrastructure/repositories/query/user-query.repository.interface';
import { IUserCommandRepository } from 'src/user/infrastructure/repositories/command/user-command.repository.interface';
import { IDriverCommandRepository } from 'src/user/infrastructure/repositories/command/driver-command.repository.interface';
import { ICustomerCommandRepository } from 'src/user/infrastructure/repositories/command/customer-command.repository.interface';
import { IOwnerCommandRepository } from 'src/user/infrastructure/repositories/command/owner-command.repository.interface';

@Injectable()
export class UserAuthService {
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
  async findUserForMiddlewareById(
    id: string,
  ): Promise<UserQueryProjection | null> {
    return await this.userQryRepo.findById(id);
  }

  // used
  async getUserForAuthByEmail(email: string): Promise<UserEntity | null> {
    const projection = await this.userCmdRepo.findByEmail(email);
    return projection ? UserMapper.toDomain(projection) : null;
  }

  // used
  async getUserForAuth(userId: string): Promise<UserEntity | null> {
    const projection = await this.userCmdRepo.findByUserId(userId);
    return projection ? UserMapper.toDomain(projection) : null;
  }

  // used
  async getDriverForAuth(userId: string): Promise<DriverEntity | null> {
    const projection = await this.driverCmdRepo.findByUserId(userId);
    return projection ? DriverMapper.toDomain(projection) : null;
  }

  // used
  async getOwnerForAuth(userId: string): Promise<OwnerEntity | null> {
    const projection = await this.ownerCmdRepo.findByUserId(userId);
    return projection ? OwnerMapper.toDomain(projection) : null;
  }

  // used
  async getCustomerForAuth(userId: string): Promise<CustomerEntity | null> {
    const projection = await this.customerCmdRepo.findByUserId(userId);
    return projection ? CustomerMapper.toDomain(projection) : null;
  }
}
