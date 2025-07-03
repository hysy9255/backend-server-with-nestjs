import { UserRole } from 'src/constants/userRole';

type ClientQueryProjection = {
  id: string;
  userId: string;
};
type OwnerQueryProjection = {
  id: string;
  userId: string;
};
type DriverQueryProjection = {
  id: string;
  userId: string;
};

export type AuthenticatedUser =
  | ({ role: UserRole.Client } & ClientQueryProjection)
  | ({ role: UserRole.Owner } & OwnerQueryProjection)
  | ({ role: UserRole.Driver } & DriverQueryProjection);
