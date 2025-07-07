import { UserInfoProjection } from '../user.info.projection';

export interface IOwnerQueryRepository {
  findByUserId(userId: string): Promise<UserInfoProjection | null>;
}
