import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserInput, CreateUserOutput } from './dtos/CreateUser.dto';
import { UserRepository } from './repositories/user-repository.interface';
import {
  ChangePasswordInput,
  ChangePasswordOutput,
} from './dtos/ChangePassword.dto';
import { ERROR_MESSAGES } from 'src/constants/errorMessages';
import { UserEntity } from './domain/user.entity';
import { UserMapper } from './mapper/user.mapper';
import { UserRecord } from './orm-records/user.record';
// import { UserFactory } from './domain/user.factory';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    // private readonly userFactory: UserFactory,
  ) {}

  async createUser(createUserInput: CreateUserInput): Promise<void> {
    try {
      await this.validateDuplicateEmail(createUserInput.email);

      const user = UserEntity.createNew(
        createUserInput.email,
        createUserInput.password,
        createUserInput.role,
      );

      await user.hashPassword();

      await this.userRepository.save(UserMapper.toRecord(user));
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) throw e;
      throw new InternalServerErrorException(
        ERROR_MESSAGES.USER_CREATION_FAILED,
      );
    }
  }

  async changePassword(
    user: UserEntity,
    changePasswordInput: ChangePasswordInput,
  ): Promise<void> {
    try {
      await user.checkPassword(changePasswordInput.password);

      user.changePassword(changePasswordInput.newPassword);

      await user.hashPassword();

      await this.userRepository.save(UserMapper.toRecord(user));
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) throw e;
      throw new InternalServerErrorException(
        ERROR_MESSAGES.PASSWORD_CHANGE_FAILED,
      );
    }
  }

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

  async findUserById(id: string) {
    try {
      const result = await this.userRepository.findById(id);
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

  async findUserWithAssociatedRestaurantById(id: string) {
    try {
      const result =
        await this.userRepository.findWithAssociatedRestaurantById(id);
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
}
