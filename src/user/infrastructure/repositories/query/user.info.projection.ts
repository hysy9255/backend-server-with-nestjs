import { UserRole } from 'src/constants/userRole';

type BaseInfo = {
  userId: string;
};

export type ClientInfo = BaseInfo & {
  role: UserRole.Client;
  clientId: string;
};

export type OwnerInfo = BaseInfo & {
  role: UserRole.Owner;
  ownerId: string;
};

export type DriverInfo = BaseInfo & {
  role: UserRole.Driver;
  driverId: string;
};

export type UserInfoProjection = ClientInfo | OwnerInfo | DriverInfo;
