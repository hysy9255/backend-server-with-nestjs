import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/constants/userRole';

@InputType()
export class CreateUserInput {
  @ApiProperty({ example: 'test@example.com', description: 'User email' })
  @Field(() => String)
  email: string;

  @ApiProperty({ example: 'testPassword', description: 'User password' })
  @Field(() => String)
  password: string;
}

@InputType()
export class CreateOwnerInput extends CreateUserInput {
  @ApiProperty({ example: 'Owner', description: 'User role' })
  @Field(() => UserRole)
  role: UserRole;
}

@InputType()
export class CreateCustomerInput extends CreateUserInput {
  @ApiProperty({ example: 'Client', description: 'User role' })
  @Field(() => UserRole)
  role: UserRole;

  @ApiProperty({
    example: '123 Main St, City, Country',
    description: 'Delivery address for the customer',
  })
  @Field(() => String)
  deliveryAddress: string;
}

@InputType()
export class CreateDriverInput extends CreateUserInput {
  @ApiProperty({ example: 'Delivery', description: 'User role' })
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
