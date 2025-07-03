import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  Client = 'Client',
  Owner = 'Owner',
  Driver = 'Driver',
}

registerEnumType(UserRole, { name: 'UserRole' });
