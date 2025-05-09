import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput, CreateUserOutput } from './dtos/CreateUser.dto';
import { UserService } from './user.service';
import {
  ChangePasswordInput,
  ChangePasswordOutput,
} from './dtos/ChangePassword.dto';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => String)
  hello() {
    return 'hi';
  }

  @Mutation(() => CreateUserOutput)
  createUser(
    @Args('input') createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    return this.userService.createUser(createUserInput);
  }

  @Mutation(() => ChangePasswordOutput)
  async changePassword(
    @Args('input') changePasswordInput: ChangePasswordInput,
  ): Promise<ChangePasswordOutput> {
    const user = await this.userService.findUserByEmail('test@example.com');
    return this.userService.changePassword(user, changePasswordInput);
  }
}
