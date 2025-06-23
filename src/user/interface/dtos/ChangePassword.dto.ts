import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/constants/userRole';

@InputType()
export class ChangePasswordInput {
  @ApiProperty({ example: 'password', description: 'existing password' })
  @Field(() => String)
  password: string;

  @ApiProperty({ example: 'newPassword', description: 'new password' })
  @Field(() => String)
  newPassword: string;
}

// @ObjectType()
// export class ChangePasswordOutput {
//   @Field(() => String)
//   id: string;

//   @Field(() => String)
//   email: string;

//   @Field(() => UserRole)
//   role: UserRole;
// }
