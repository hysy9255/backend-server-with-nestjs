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

@InputType()
export class CreateOwnerInput extends CreateUserInput {}

@InputType()
export class CreateCustomerInput extends CreateUserInput {
  @Field(() => String)
  deliveryAddress: string;
}

@InputType()
export class CreateDriverInput extends CreateUserInput {}

@ObjectType()
export class CreateUserOutput {
  @Field(() => String)
  id: string;

  @Field(() => String)
  email: string;

  @Field(() => UserRole)
  role: UserRole;
}
