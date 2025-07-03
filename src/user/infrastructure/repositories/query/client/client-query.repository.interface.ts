import { UserInfoProjection } from '../user.info.projection';

export interface IClientQueryRepository {
  findByUserId(userId: string): Promise<UserInfoProjection | null>;
}
