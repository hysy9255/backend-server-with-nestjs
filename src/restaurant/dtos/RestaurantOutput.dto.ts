import { Restaurant } from '../orm-records/restaurant.record';

export class RestaurantOutput {
  id: string;
  name: string;
  address: string;
  category: string;

  constructor(entity: Restaurant) {
    this.id = entity.id;
    this.name = entity.name;
    this.address = entity.address;
    this.category = entity.category;
  }
}
