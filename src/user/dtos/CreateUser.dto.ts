import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { UserRole } from 'src/constants/userRole';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => UserRole)
  role: UserRole;
}

@ObjectType()
export class CreateUserOutput {
  @Field(() => String)
  id: string;

  @Field(() => String)
  email: string;

  @Field(() => UserRole)
  role: UserRole;
}
