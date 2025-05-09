import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { UserRole } from 'src/constants/userRole';

@InputType()
export class ChangePasswordInput {
  @Field(() => String)
  password: string;

  @Field(() => String)
  newPassword: string;
}

@ObjectType()
export class ChangePasswordOutput {
  @Field(() => String)
  id: string;

  @Field(() => String)
  email: string;

  @Field(() => UserRole)
  role: UserRole;
}
