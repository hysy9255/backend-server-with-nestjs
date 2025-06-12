import { RestaurantSummaryProjection } from '../projections/restaurant.projection';

export interface IRestaurantQueryRepository {
  findSummary(restaurantId: string): Promise<RestaurantSummaryProjection>;
  findSummaries(): Promise<RestaurantSummaryProjection[]>;
}
