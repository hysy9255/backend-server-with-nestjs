import { OrderStatus } from 'src/constants/orderStatus';

type Order = {
  id: string;
  status: OrderStatus;
  deliveryAddress: string;
  clientId: string;
  driverId: string | null;
  ownerId: string;
  restaurantId: string;
  restaurantName: string;
};

export type OrderForClient = Required<Order>;
export type OrderForOwner = Omit<Order, 'restaurantName'>;
export type OrderForDriver = Required<Order>;
