import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/constants/errorMessages';
import { UserRole } from 'src/constants/userRole';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export class UserEntity {
  constructor(
    private readonly _id: string,
    private readonly _email: string,
    private _password: string,
    private readonly _role: UserRole,
  ) {}

  static createNew(
    email: string,
    password: string,
    role: UserRole,
  ): UserEntity {
    return new UserEntity(uuidv4(), email, password, role);
  }

  static fromPersistance(
    id: string,
    email: string,
    password: string,
    role: UserRole,
  ): UserEntity {
    return new UserEntity(id, email, password, role);
  }

  get id() {
    return this._id;
  }

  get email() {
    return this._email;
  }

  get role() {
    return this._role;
  }

  checkUserRole(role: UserRole): void {
    const matches = this._role === role;
    if (!matches) {
      throw new BadRequestException(ERROR_MESSAGES.USER_ROLE_MISMATCH);
    }
  }

  async hashPassword(): Promise<void> {
    if (this._password) {
      try {
        this._password = await bcrypt.hash(this._password, 10);
      } catch (e) {
        console.error(e);
        throw new InternalServerErrorException(ERROR_MESSAGES.HASH_FAILED);
      }
    }
  }

  async checkPassword(aPassword: string): Promise<void> {
    try {
      const ok = await bcrypt.compare(aPassword, this._password);
      if (!ok) {
        throw new BadRequestException(ERROR_MESSAGES.WRONG_PASSWORD);
      }
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) throw e;
      throw new InternalServerErrorException(
        ERROR_MESSAGES.PASSWORD_CHECK_FAILED,
      );
    }
  }
}
