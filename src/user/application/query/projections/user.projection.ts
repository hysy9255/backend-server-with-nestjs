import { UserRole } from 'src/constants/userRole';

export class UserSummaryProjection {
  id: string;
  email: string;
  role: UserRole;
}
