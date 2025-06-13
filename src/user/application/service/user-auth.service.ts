import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { IUserCommandRepository } from '../command/repositories/user-command.repository.interface';
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
import { UserSummaryProjection } from '../query/projections/user.projection';
import { ICustomerCommandRepository } from '../command/repositories/customer-command.repository.interface';
import { IDriverCommandRepository } from '../command/repositories/driver-command.repository.interface';
import { IUserQueryRepository } from '../query/repositories/user-query.repository.interface';

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
  ): Promise<UserSummaryProjection | null> {
    return await this.userQryRepo.findById(id);
  }

  // used
  async getUserForAuthByEmail(email: string): Promise<UserEntity | null> {
    try {
      const projection = await this.userCmdRepo.findByEmail(email);
      return projection ? UserMapper.toDomain(projection) : null;
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) throw e;
      throw new InternalServerErrorException(ERROR_MESSAGES.FIND_USER_FAILED);
    }
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
