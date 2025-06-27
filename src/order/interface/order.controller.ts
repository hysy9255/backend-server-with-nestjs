import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { Role } from 'src/auth/role.decorator';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ClientOrderService } from '../application/service/clientOrder.service';
import {
  CreateOrderInput,
  GetOrderInput,
  OrderActionInput,
} from './dtos/order-inputs.dto';
import { GetRestaurantInput } from 'src/restaurant/interface/dtos/restaurant-inputs.dto';
import { OwnerOrderService } from '../application/service/ownerOrder.service';
import { DriverOrderService } from '../application/service/driverOrder.service';
import {
  RestClientOrderPreviewDTO,
  RestClientOrderSummaryDTO,
  RestDriverOrderSummaryDTO,
  RestOwnerOrderSummaryDTO,
} from './dtos/rest/order-output.rest.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UserQueryProjection } from 'src/user/infrastructure/repositories/query/user-query.repository.interface';

@ApiTags('Order - [Client]')
@ApiSecurity('jwt-token')
@Controller('api/client')
export class ClientOrderController {
  constructor(private readonly clientOrderService: ClientOrderService) {}

  @ApiOperation({ summary: '[Client] Create an order' })
  @ApiBody({ type: CreateOrderInput })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: Boolean,
  })
  @Post('order')
  @Role(['Client'])
  async createOrder(
    @AuthUser() user: UserQueryProjection,
    @Body() createOrderInput: CreateOrderInput,
  ): Promise<boolean> {
    await this.clientOrderService.createOrder(user, createOrderInput);
    return true;
  }

  @ApiOperation({ summary: '[Client] Get on-going order' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: RestClientOrderSummaryDTO,
  })
  @Get('on-going-order')
  @Role(['Client'])
  async getOnGoingOrderForClient(
    @AuthUser() user: UserQueryProjection,
  ): Promise<RestClientOrderSummaryDTO> {
    return new RestClientOrderSummaryDTO(
      await this.clientOrderService.getOnGoingOrder(user),
    );
  }

  @ApiOperation({ summary: '[Client] Get order history' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: [RestClientOrderPreviewDTO],
  })
  @Get('order-history')
  @Role(['Client'])
  async getOrderHistoryForClient(@AuthUser() user: UserQueryProjection) {
    const orders = await this.clientOrderService.getOrderHistory(user);
    return orders.map((order) => new RestClientOrderPreviewDTO(order));
  }

  @ApiOperation({ summary: '[Client] Get order by id' })
  @ApiParam({ name: 'id', type: String, description: 'Order Id' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: RestClientOrderSummaryDTO,
  })
  @Get('order/:id')
  @Role(['Client'])
  async getOrderForClient(
    @AuthUser() user: UserQueryProjection,
    @Param('id') orderId: GetRestaurantInput['id'],
  ): Promise<RestClientOrderSummaryDTO> {
    return new RestClientOrderSummaryDTO(
      await this.clientOrderService.getOrderSummaryForClient(user, orderId),
    );
  }
}

@ApiTags('Order - [Owner]')
@ApiSecurity('jwt-token')
@Controller('api/owner')
export class OwnerOrderController {
  constructor(private readonly ownerOrderService: OwnerOrderService) {}

  @ApiOperation({ summary: '[Owner] Get orders for owner' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: [RestOwnerOrderSummaryDTO],
  })
  @Get('orders')
  @Role(['Owner'])
  async getOrdersForOwner(
    @AuthUser() user: UserQueryProjection,
  ): Promise<RestOwnerOrderSummaryDTO[]> {
    const orders = await this.ownerOrderService.getOrders(user);
    return orders.map((order) => new RestOwnerOrderSummaryDTO(order));
  }

  @ApiOperation({ summary: '[Owner] Get order by id' })
  @ApiParam({ name: 'id', type: String, description: 'Order Id' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: RestOwnerOrderSummaryDTO,
  })
  @Get('order/:id')
  @Role(['Owner'])
  async getOrderForOwner(
    @AuthUser() user: UserQueryProjection,
    @Param('id') orderId: GetOrderInput['orderId'],
  ): Promise<RestOwnerOrderSummaryDTO> {
    const order = await this.ownerOrderService.getOrder(user, orderId);
    return new RestOwnerOrderSummaryDTO(order);
  }

  @ApiOperation({ summary: '[Owner] Accept order' })
  @ApiParam({ name: 'id', type: String, description: 'Order Id' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: Boolean,
  })
  @Patch('order/:id/accept')
  @Role(['Owner'])
  async acceptOrderByOwner(
    @AuthUser() user: UserQueryProjection,
    @Param('id') { orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.ownerOrderService.acceptOrder(orderId, user);
    return true;
  }

  @ApiOperation({ summary: '[Owner] Reject order' })
  @ApiParam({ name: 'id', type: String, description: 'Order Id' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: Boolean,
  })
  @Patch('order/:id/reject')
  @Role(['Owner'])
  async rejectOrderByOwner(
    @AuthUser() user: UserQueryProjection,
    @Param('id') { orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.ownerOrderService.rejectOrder(orderId, user);
    return true;
  }

  @ApiOperation({ summary: '[Owner] Mark order as ready' })
  @ApiParam({ name: 'id', type: String, description: 'Order Id' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: Boolean,
  })
  @Patch('order/:id/mark-ready')
  @Role(['Owner'])
  async markOrderAsReadyByOwner(
    @AuthUser() user: UserQueryProjection,
    @Param('id') { orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.ownerOrderService.markOrderAsReady(orderId, user);
    return true;
  }
}

@ApiTags('Order - [Driver]')
@ApiSecurity('jwt-token')
@Controller('api/driver')
export class DriverOrderController {
  constructor(private readonly driverOrderService: DriverOrderService) {}

  @ApiOperation({ summary: '[Driver] Get orders' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: [RestDriverOrderSummaryDTO],
  })
  @Get('orders')
  @Role(['Delivery'])
  async getOrdersForDriver(
    @AuthUser() user: UserQueryProjection,
  ): Promise<RestDriverOrderSummaryDTO[]> {
    const orders = await this.driverOrderService.getOrdersForDriver(user);
    return orders.map((order) => new RestDriverOrderSummaryDTO(order));
  }

  @ApiOperation({ summary: '[Driver] Get order' })
  @ApiParam({ name: 'id', type: String, description: 'Order Id' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: RestDriverOrderSummaryDTO,
  })
  @Get('order/:id')
  @Role(['Delivery'])
  async getOrderForDriver(
    @AuthUser() user: UserQueryProjection,
    @Param('id') orderId: GetOrderInput['orderId'],
  ): Promise<RestDriverOrderSummaryDTO> {
    const order = await this.driverOrderService.getOrderForDriver(
      user,
      orderId,
    );
    return new RestDriverOrderSummaryDTO(order);
  }

  @ApiOperation({ summary: '[Driver] Accept order' })
  @ApiParam({ name: 'id', type: String, description: 'Order Id' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: Boolean,
  })
  @Post('order/:id/accept')
  @Role(['Delivery'])
  async acceptOrderByDriver(
    @AuthUser() user: UserQueryProjection,
    @Param('id') { orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.driverOrderService.acceptOrder(orderId, user);
    return true;
  }

  @ApiOperation({ summary: '[Driver] Reject order' })
  @ApiParam({ name: 'id', type: String, description: 'Order Id' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: Boolean,
  })
  @Post('order/:id/reject')
  @Role(['Delivery'])
  async rejectOrderByDriver(
    @AuthUser() user: UserQueryProjection,
    @Param('id') { orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.driverOrderService.rejectOrder(orderId, user);
    return true;
  }

  @ApiOperation({ summary: '[Driver] Pick up order' })
  @ApiParam({ name: 'id', type: String, description: 'Order Id' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: Boolean,
  })
  @Patch('order/:id/pickup')
  @Role(['Delivery'])
  async pickUpOrderByDriver(
    @AuthUser() user: UserQueryProjection,
    @Param('id') { orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.driverOrderService.pickupOrder(orderId, user);
    return true;
  }

  @ApiOperation({ summary: '[Driver] Complete delivery' })
  @ApiParam({ name: 'id', type: String, description: 'Order Id' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: Boolean,
  })
  @Patch('order/:id/complete')
  @Role(['Delivery'])
  async completeDelivery(
    @AuthUser() user: UserQueryProjection,
    @Param('id') { orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.driverOrderService.completeDelivery(orderId, user);
    return true;
  }
}
