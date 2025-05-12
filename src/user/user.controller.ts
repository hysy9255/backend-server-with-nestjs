import { Body, Controller, Patch, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserInput, CreateUserOutput } from './dtos/CreateUser.dto';
import {
  ChangePasswordInput,
  ChangePasswordOutput,
} from './dtos/ChangePassword.dto';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(
    @Body() createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    return this.userService.createUser(createUserInput);
  }

  @Patch('/password')
  async changePassword(
    @Req() req: Request,
    @Body() changePasswordInput: ChangePasswordInput,
  ): Promise<ChangePasswordOutput> {
    const user = req['user'];
    return this.userService.changePassword(user, changePasswordInput);
  }
}
