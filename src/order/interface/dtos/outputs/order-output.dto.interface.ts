import { OrderStatus } from 'src/constants/orderStatus';

export interface IOrderDTO {
  id: string;
  status: OrderStatus;
  deliveryAddress: string;
  clientId: string;
  driverId: string | null;
  restaurantId: string;
  restaurantName: string;
}

export interface IClientOrderDTO extends IOrderDTO {}
export interface IOwnerOrderDTO extends Omit<IOrderDTO, 'restaurantName'> {}
export interface IDriverOrderDTO extends IOrderDTO {}

// prettier-ignore
export interface IClientOrderPreviewDTO extends Pick<IOrderDTO, 'id' | 'status' | 'restaurantId' | 'restaurantName'> {}
// prettier-ignore
export interface IOwnerOrderPreviewDTO extends Pick<IOrderDTO, 'id' | 'status' | 'driverId'> {}
// prettier-ignore
export interface IDriverOrderPreviewDTO extends Pick<IOrderDTO, 'id' | 'status' | 'restaurantId' | 'deliveryAddress'> {}
