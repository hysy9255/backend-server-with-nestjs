import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateClientInput,
  CreateDriverInput,
  CreateOwnerInput,
} from './dtos/create-user.dto';
import { UserService } from '../application/service/user.external.service';
import { ChangePasswordInput } from './dtos/change-password.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserEntity } from '../domain/user.entity';
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
  async createClient(
    @Args('input') createClientInput: CreateClientInput,
  ): Promise<boolean> {
    await this.userService.createClient(createClientInput);
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
