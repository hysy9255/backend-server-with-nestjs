import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput, CreateUserOutput } from './dtos/CreateUser.dto';
import { UserService } from './user.service';
import {
  ChangePasswordInput,
  ChangePasswordOutput,
} from './dtos/ChangePassword.dto';
import { User } from './domain/user.entity';

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
    @Context() context,
    @Args('input') changePasswordInput: ChangePasswordInput,
  ): Promise<ChangePasswordOutput> {
    const user = context.req.user;
    return this.userService.changePassword(user, changePasswordInput);
  }
}
