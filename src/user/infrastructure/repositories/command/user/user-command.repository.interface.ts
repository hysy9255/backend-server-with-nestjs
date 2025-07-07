import { UserRole } from 'src/constants/userRole';
import { UserOrmEntity } from 'src/user/infrastructure/orm-entities/user.orm.entity';

export class UserCmdProjection {
  id: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface IUserCommandRepository {
  save(user: UserOrmEntity): Promise<void>;
  findByEmail(email: string): Promise<UserCmdProjection | null>;
  findByUserId(userId: string): Promise<UserCmdProjection | null>;
}
