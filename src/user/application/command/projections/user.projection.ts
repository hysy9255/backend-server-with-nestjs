import { UserRole } from 'src/constants/userRole';

export class UserProjection {
  id: string;
  email: string;
  password: string;
  role: UserRole;
}
