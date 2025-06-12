import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}

@ObjectType()
export class LoginOutput {
  @Field(() => String)
  token: string;
}
