import { UserRole } from 'src/constants/userRole';

export class UserQueryProjection {
  id: string;
  email: string;
  role: UserRole;
}

export interface IUserQueryRepository {
  findByEmail(email: string): Promise<UserQueryProjection | null>;
  findById(id: string): Promise<UserQueryProjection>;
}
