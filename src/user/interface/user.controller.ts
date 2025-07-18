import { Body, Controller, Post, UseGuards, Req, Patch } from '@nestjs/common';
import { UserService } from '../application/service/user.external.service';
import {
  CreateClientInput,
  CreateDriverInput,
  CreateOwnerInput,
} from './dtos/create-user.dto';
import { ChangePasswordInput } from './dtos/change-password.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/auth/role.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UserEntity } from '../domain/user.entity';
import { ApiBody, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

// @ApiTags('User')
@Controller('api/user')
// @UseGuards(AuthGuard) // 전체 컨트롤러에 가드 적용
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '[Any] Create a new owner' })
  @ApiBody({ type: CreateOwnerInput })
  @Post('owner')
  @Role(['Any'])
  async createOwner(
    @Body() createOwnerInput: CreateOwnerInput,
  ): Promise<boolean> {
    await this.userService.createOwner(createOwnerInput);
    return true;
  }

  @ApiOperation({ summary: '[Any] Create a new client' })
  @ApiBody({ type: CreateClientInput })
  @Post('client')
  @Role(['Any'])
  async createClient(
    @Body() createClientInput: CreateClientInput,
  ): Promise<boolean> {
    await this.userService.createClient(createClientInput);
    return true;
  }

  @ApiOperation({ summary: '[Any] Create a new driver' })
  @ApiBody({ type: CreateDriverInput })
  @Post('driver')
  @Role(['Any'])
  async createDriver(
    @Body() createDriverInput: CreateDriverInput,
  ): Promise<boolean> {
    await this.userService.createDriver(createDriverInput);
    return true;
  }

  @ApiSecurity('jwt-token')
  @ApiOperation({ summary: '[Any] Change password' })
  @ApiBody({ type: ChangePasswordInput })
  @Patch('password')
  @Role(['Any'])
  async changePassword(
    @AuthUser() user: UserEntity,
    @Body() changePasswordInput: ChangePasswordInput,
  ): Promise<boolean> {
    await this.userService.changePassword(user, changePasswordInput);
    return true;
  }
}
