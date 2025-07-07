import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class ChangePasswordInput {
  @ApiProperty({ example: 'password', description: 'existing password' })
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'newPassword', description: 'new password' })
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
