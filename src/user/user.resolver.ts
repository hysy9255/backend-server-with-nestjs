import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput, CreateUserOutput } from './dtos/CreateUser.dto';
import { UserService } from './user.service';
import {
  ChangePasswordInput,
  ChangePasswordOutput,
} from './dtos/ChangePassword.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => CreateUserOutput)
  createUser(
    @Args('input') createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    return this.userService.createUser(createUserInput);
  }

  @Mutation(() => ChangePasswordOutput)
  @UseGuards(AuthGuard)
  async changePassword(
    @Context() context,
    @Args('input') changePasswordInput: ChangePasswordInput,
  ): Promise<ChangePasswordOutput> {
    const user = context.req.user;
    return this.userService.changePassword(user, changePasswordInput);
  }
}
