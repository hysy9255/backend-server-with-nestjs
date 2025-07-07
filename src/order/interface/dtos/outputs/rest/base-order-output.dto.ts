import { ApiProperty } from '@nestjs/swagger';
import { IOrderDTO } from '../order-output.dto.interface';
import { OrderStatus } from 'src/constants/orderStatus';

export class RestOrderDTO implements IOrderDTO {
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
    description: 'Client ID',
  })
  clientId: string;

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
