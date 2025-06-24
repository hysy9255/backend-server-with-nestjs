import { OrderStatus } from 'src/constants/orderStatus';

export interface IBaseOrderDTO {
  id: string;
  status: OrderStatus;
  deliveryAddress: string;
  customerId: string;
  driverId: string | null;
  restaurantId: string;
  restaurantName: string;
}

export interface IClientOrderSummaryDTO extends IBaseOrderDTO {}

export interface IOwnerOrderSummaryDTO
  extends Omit<IBaseOrderDTO, 'restaurantName'> {}

export interface IDriverOrderSummaryDTO extends IBaseOrderDTO {}

export interface IClientOrderPreviewDTO
  extends Pick<
    IBaseOrderDTO,
    'id' | 'status' | 'restaurantId' | 'restaurantName'
  > {}

export interface IOwnerOrderPreviewDTO
  extends Pick<IBaseOrderDTO, 'id' | 'status' | 'driverId'> {}

export interface IDriverOrderPreviewDTO
  extends Pick<
    IBaseOrderDTO,
    'id' | 'status' | 'restaurantId' | 'deliveryAddress'
  > {}
