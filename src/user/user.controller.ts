import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserInput, CreateUserOutput } from './dtos/CreateUser.dto';
import {
  ChangePasswordInput,
  ChangePasswordOutput,
} from './dtos/ChangePassword.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(
    @Body() createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    return this.userService.createUser(createUserInput);
  }

  @Post()
  async changePassword(
    @Body() changePasswordInput: ChangePasswordInput,
  ): Promise<ChangePasswordOutput> {
    const user = await this.userService.findUserByEmail('test@example.com');
    return this.userService.changePassword(user, changePasswordInput);
  }
}
