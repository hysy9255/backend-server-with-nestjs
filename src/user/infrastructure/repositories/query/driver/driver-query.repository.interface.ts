import { UserInfoProjection } from '../user.info.projection';

export interface IDriverQueryRepository {
  findByUserId(userId: string): Promise<UserInfoProjection | null>;
}
