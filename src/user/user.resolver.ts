import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateCustomerInput,
  CreateDriverInput,
  CreateOwnerInput,
  CreateUserInput,
  CreateUserOutput,
} from './dtos/CreateUser.dto';
import { UserService } from './user.service';
import {
  ChangePasswordInput,
  ChangePasswordOutput,
} from './dtos/ChangePassword.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserEntity } from './domain/user.entity';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => Boolean)
  @Role(['Any'])
  async createOwner(
    @Args('input') createOwnerInput: CreateOwnerInput,
  ): Promise<boolean> {
    await this.userService.createOwner(createOwnerInput);
    return true;
  }

  @Mutation(() => Boolean)
  @Role(['Any'])
  async createCustomer(
    @Args('input') createCustomerInput: CreateCustomerInput,
  ): Promise<boolean> {
    await this.userService.createCustomer(createCustomerInput);
    return true;
  }

  @Mutation(() => Boolean)
  @Role(['Any'])
  async createDriver(
    @Args('input') createDriverInput: CreateDriverInput,
  ): Promise<boolean> {
    await this.userService.createDriver(createDriverInput);
    return true;
  }

  @Mutation(() => Boolean)
  @Role(['Any'])
  async changePassword(
    @AuthUser() user: UserEntity,
    @Args('input') changePasswordInput: ChangePasswordInput,
  ): Promise<boolean> {
    await this.userService.changePassword(user, changePasswordInput);
    return true;
  }
}
