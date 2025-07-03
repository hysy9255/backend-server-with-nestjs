import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from 'src/constants/userRole';

@InputType()
export class CreateUserInput {
  @ApiProperty({ example: 'test@example.com', description: 'User email' })
  @Field(() => String)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'testPassword', description: 'User password' })
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  password: string;
}

@InputType()
export class CreateOwnerInput extends CreateUserInput {
  // @ApiProperty({ example: 'Owner', description: 'User role' })
  // @Field(() => UserRole)
  // @IsEnum(UserRole)
  // @IsNotEmpty()
  // role: UserRole;
}

@InputType()
export class CreateClientInput extends CreateUserInput {
  // @ApiProperty({ example: 'Client', description: 'User role' })
  // @Field(() => UserRole)
  // @IsNotEmpty()
  // @IsEnum(UserRole)
  // role: UserRole;

  @ApiProperty({
    example: '123 Main St, City, Country',
    description: 'Delivery address for the client',
  })
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  deliveryAddress: string;
}

@InputType()
export class CreateDriverInput extends CreateUserInput {
  // @ApiProperty({ example: 'Delivery', description: 'User role' })
  // @Field(() => UserRole)
  // @IsNotEmpty()
  // @IsEnum(UserRole)
  // role: UserRole;
}
