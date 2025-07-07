import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/constants/errorMessages';
import { IUserQueryRepository } from '../../infrastructure/repositories/query/user/user-query.repository.interface';
import { OwnerEntity } from 'src/user/domain/owner.entity';
import { OwnerMapper } from '../mapper/owner.mapper';
import { IOwnerCommandRepository } from 'src/user/infrastructure/repositories/command/owner/owner-command.repository.interface';

@Injectable()
export class UserInternalService {
  constructor(
    @Inject('IUserQueryRepository')
    private readonly userQryRepo: IUserQueryRepository,
    @Inject('IOwnerCommandRepository')
    private readonly ownerCmdRepo: IOwnerCommandRepository,
  ) {}

  async _validateDuplicateEmail(email: string): Promise<void> {
    const emailExists = await this.userQryRepo.findByEmail(email);
    if (emailExists) {
      throw new BadRequestException(ERROR_MESSAGES.DUPLICATE_EMAIL);
    }
  }

  async _updateOwner(owner: OwnerEntity): Promise<void> {
    await this.ownerCmdRepo.save(OwnerMapper.toOrmEntity(owner));
  }
}
