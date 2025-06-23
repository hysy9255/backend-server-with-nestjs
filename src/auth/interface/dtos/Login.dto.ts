import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class LoginInput {
  @ApiProperty({ example: 'test@example.com', description: 'User email' })
  @Field(() => String)
  email: string;

  @ApiProperty({ example: 'testPassword', description: 'User password' })
  @Field(() => String)
  password: string;
}

@ObjectType()
export class LoginOutput {
  @ApiProperty({ example: 'accessToken', description: 'access token' })
  @Field(() => String)
  token: string;
}
