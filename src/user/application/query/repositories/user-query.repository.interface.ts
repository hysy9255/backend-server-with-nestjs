import { UserSummaryProjection } from '../projections/user.projection';

export interface IUserQueryRepository {
  // used
  findByEmail(email: string): Promise<UserSummaryProjection | null>;
  findById(id: string): Promise<UserSummaryProjection | null>;
}
