export class RestaurantQueryProjection {
  id: string;
  name: string;
  address: string;
  category: string;
}

export interface IRestaurantQueryRepository {
  findSummary(restaurantId: string): Promise<RestaurantQueryProjection>;
  findSummaries(): Promise<RestaurantQueryProjection[]>;
}
