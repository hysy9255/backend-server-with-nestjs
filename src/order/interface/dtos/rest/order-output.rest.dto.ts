import { OrderStatus } from 'src/constants/orderStatus';
import {
  IBaseOrderDTO,
  IClientOrderPreviewDTO,
  IClientOrderSummaryDTO,
  IDriverOrderSummaryDTO,
  IOwnerOrderSummaryDTO,
} from '../order-output.dto.interface';
import {
  ClientOrderPreviewProjection,
  ClientOrderSummaryProjection,
  DriverOrderSummaryProjection,
  OwnerOrderSummaryProjection,
} from 'src/order/infrastructure/repositories/query/projections/order.projection';
import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';

export class RestBaseOrderDTO implements IBaseOrderDTO {
  @ApiProperty({
    example: 'uuid',
    description: 'Order ID',
  })
  id: string;
  @ApiProperty({
    example: 'Pending',
    description: 'Order Status',
  })
  status: OrderStatus;
  @ApiProperty({
    example: '123 Main St, Springfield, USA',
    description: 'Delivery Address',
  })
  deliveryAddress: string;
  @ApiProperty({
    example: 'uuid',
    description: 'Customer ID',
  })
  customerId: string;
  @ApiProperty({
    example: 'uuid',
    description: 'Driver ID',
    nullable: true,
  })
  driverId: string | null;
  @ApiProperty({
    example: 'uuid',
    description: 'Restaurant ID',
  })
  restaurantId: string;
  @ApiProperty({
    example: 'Restaurant Name',
    description: 'Restaurant Name',
  })
  restaurantName: string;
}

export class RestClientOrderSummaryDTO
  extends OmitType(RestBaseOrderDTO, [])
  implements IClientOrderSummaryDTO
{
  constructor(projection: ClientOrderSummaryProjection) {
    super();
    Object.assign(this, projection);
  }
}

export class RestClientOrderPreviewDTO
  extends PickType(RestBaseOrderDTO, [
    'id',
    'status',
    'restaurantId',
    'restaurantName',
  ])
  implements IClientOrderPreviewDTO
{
  constructor(projection: ClientOrderPreviewProjection) {
    super();
    Object.assign(this, projection);
  }
}

export class RestOwnerOrderSummaryDTO
  extends OmitType(RestBaseOrderDTO, ['restaurantName'])
  implements IOwnerOrderSummaryDTO
{
  constructor(projection: OwnerOrderSummaryProjection) {
    super();
    Object.assign(this, projection);
  }
}

export class RestDriverOrderSummaryDTO
  extends OmitType(RestBaseOrderDTO, [])
  implements IDriverOrderSummaryDTO
{
  constructor(projection: DriverOrderSummaryProjection) {
    super();
    Object.assign(this, projection);
  }
}
