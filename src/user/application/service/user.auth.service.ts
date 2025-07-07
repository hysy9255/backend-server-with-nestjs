import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../../domain/user.entity';
import { DriverEntity } from '../../domain/driver.entity';
import { OwnerEntity } from '../../domain/owner.entity';
import { ClientEntity } from '../../domain/client.entity';

import {
  IUserQueryRepository,
  UserQueryProjection,
} from '../../infrastructure/repositories/query/user/user-query.repository.interface';
import { IUserCommandRepository } from 'src/user/infrastructure/repositories/command/user/user-command.repository.interface';

import { DriverMapper } from '../mapper/driver.mapper';
import { UserMapper } from '../mapper/user.mapper';
import { OwnerMapper } from '../mapper/owner.mapper';
import { ClientMapper } from '../mapper/client.mapper';
import { IDriverCommandRepository } from 'src/user/infrastructure/repositories/command/driver/driver-command.repository.interface';
import { IClientCommandRepository } from 'src/user/infrastructure/repositories/command/client/client-command.repository.interface';
import { IOwnerCommandRepository } from 'src/user/infrastructure/repositories/command/owner/owner-command.repository.interface';
import { IClientQueryRepository } from 'src/user/infrastructure/repositories/query/client/client-query.repository.interface';
import { IOwnerQueryRepository } from 'src/user/infrastructure/repositories/query/owner/owner-query.repository.interface';
import { IDriverQueryRepository } from 'src/user/infrastructure/repositories/query/driver/driver-query.repository.interface';

@Injectable()
export class UserAuthService {
  constructor(
    @Inject('IUserQueryRepository')
    private readonly userQryRepo: IUserQueryRepository,
    @Inject('IUserCommandRepository')
    private readonly userCmdRepo: IUserCommandRepository,
    @Inject('IDriverCommandRepository')
    private readonly driverCmdRepo: IDriverCommandRepository,
    @Inject('IClientCommandRepository')
    private readonly clientCmdRepo: IClientCommandRepository,
    @Inject('IOwnerCommandRepository')
    private readonly ownerCmdRepo: IOwnerCommandRepository,
    @Inject('IOwnerQueryRepository')
    private readonly ownerQryRepo: IOwnerQueryRepository,
    @Inject('IClientQueryRepository')
    private readonly clientQryRepo: IClientQueryRepository,
    @Inject('IDriverQueryRepository')
    private readonly driverQryRepo: IDriverQueryRepository,
  ) {}

  // used
  async findUserForMiddlewareById(id: string): Promise<UserQueryProjection> {
    return await this.userQryRepo.findById(id);
  }

  async _getOwnerInfo(userId: string) {
    const ownerInfo = await this.ownerQryRepo.findByUserId(userId);
    if (!ownerInfo) throw new NotFoundException('Owner Info Not Found');
    return ownerInfo;
  }

  async _getClientInfo(userId: string) {
    const clientInfo = await this.clientQryRepo.findByUserId(userId);
    if (!clientInfo) throw new NotFoundException('Client Info Not Found');
    return clientInfo;
  }

  async _getDriverInfo(userId: string) {
    const driverInfo = await this.driverQryRepo.findByUserId(userId);
    if (!driverInfo) throw new NotFoundException('Driver Info Not Found');
    return driverInfo;
  }

  async _getUser(email: string): Promise<UserEntity> {
    const user = await this.userCmdRepo.findByEmail(email);
    if (!user) throw new NotFoundException('User Not Found');

    return UserMapper.toDomain(user);
  }

  async _getDriver(userId: string): Promise<DriverEntity> {
    const driver = await this.driverCmdRepo.findByUserId(userId);
    if (!driver) throw new NotFoundException('Driver Not Found');

    return DriverMapper.toDomain(driver);
  }

  async _getOwner(userId: string): Promise<OwnerEntity> {
    const owner = await this.ownerCmdRepo.findByUserId(userId);
    if (!owner) throw new NotFoundException('Owner Not Found');

    return OwnerMapper.toDomain(owner);
  }

  async _getClient(userId: string): Promise<ClientEntity> {
    const client = await this.clientCmdRepo.findByUserId(userId);
    if (!client) throw new NotFoundException('Client Not Found');

    return ClientMapper.toDomain(client);
  }
}
