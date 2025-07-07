import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Role } from 'src/auth/role.decorator';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ClientOrderService } from '../application/service/order.external.client.service';
import {
  CreateOrderInput,
  GetOrderInput,
  OrderActionInput,
} from './dtos/inputs/order-inputs.dto';
import { OwnerOrderService } from '../application/service/order.external.owner.service';
import { DriverOrderService } from '../application/service/order.external.driver.service';
import {
  RestClientOrderPreviewDTO,
  RestClientOrderDTO,
  RestDriverOrderDTO,
  RestOwnerOrderDTO,
} from './dtos/outputs/rest/order-output.dtos';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UserInfoProjection } from 'src/user/infrastructure/repositories/query/user.info.projection';

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
    @AuthUser() userInfo: UserInfoProjection,
    @Body() createOrderInput: CreateOrderInput,
  ): Promise<boolean> {
    await this.clientOrderService.createOrder(userInfo, createOrderInput);
    return true;
  }

  @ApiOperation({ summary: '[Client] Get on-going order' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: RestClientOrderDTO,
  })
  @Get('on-going-order')
  @Role(['Client'])
  async getOnGoingOrderForClient(
    @AuthUser() userInfo: UserInfoProjection,
  ): Promise<RestClientOrderDTO | null> {
    const result = await this.clientOrderService.getOnGoing(userInfo);
    return result ? new RestClientOrderDTO(result) : null;
  }

  @ApiOperation({ summary: '[Client] Get order history' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: [RestClientOrderPreviewDTO],
  })
  @Get('order-history')
  @Role(['Client'])
  async getOrderHistoryForClient(@AuthUser() userInfo: UserInfoProjection) {
    const orders = await this.clientOrderService.getHistory(userInfo);
    return orders.map((order) => new RestClientOrderPreviewDTO(order));
  }

  @ApiOperation({ summary: '[Client] Get order by id' })
  @ApiParam({ name: 'id', type: String, description: 'Order Id' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: RestClientOrderDTO,
  })
  @Get('order/:id')
  @Role(['Client'])
  async getOrderForClient(
    @AuthUser() userInfo: UserInfoProjection,
    @Param() { orderId }: GetOrderInput,
  ): Promise<RestClientOrderDTO> {
    return new RestClientOrderDTO(
      await this.clientOrderService.getOrder(userInfo, orderId),
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
    type: [RestOwnerOrderDTO],
  })
  @Get('orders')
  @Role(['Owner'])
  async getOrdersForOwner(
    @AuthUser() userInfo: UserInfoProjection,
  ): Promise<RestOwnerOrderDTO[]> {
    const orders = await this.ownerOrderService.getOrders(userInfo);
    return orders.map((order) => new RestOwnerOrderDTO(order));
  }

  @ApiOperation({ summary: '[Owner] Get order by id' })
  @ApiParam({ name: 'id', type: String, description: 'Order Id' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: RestOwnerOrderDTO,
  })
  @Get('order/:id')
  @Role(['Owner'])
  async getOrderForOwner(
    @AuthUser() userInfo: UserInfoProjection,
    @Param() { orderId }: GetOrderInput,
  ): Promise<RestOwnerOrderDTO> {
    const order = await this.ownerOrderService.getOrder(userInfo, orderId);
    return new RestOwnerOrderDTO(order);
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
    @AuthUser() userInfo: UserInfoProjection,
    @Param() { id: orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.ownerOrderService.accept(orderId, userInfo);
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
    @AuthUser() userInfo: UserInfoProjection,
    @Param() { id: orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.ownerOrderService.reject(orderId, userInfo);
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
    @AuthUser() userInfo: UserInfoProjection,
    @Param() { id: orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.ownerOrderService.markReady(orderId, userInfo);
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
    type: [RestDriverOrderDTO],
  })
  @Get('orders')
  @Role(['Driver'])
  async getOrdersForDriver(
    @AuthUser() userInfo: UserInfoProjection,
  ): Promise<RestDriverOrderDTO[]> {
    const orders = await this.driverOrderService.getOrders(userInfo);
    return orders.map((order) => new RestDriverOrderDTO(order));
  }

  @ApiOperation({ summary: '[Driver] Get order' })
  @ApiParam({ name: 'id', type: String, description: 'Order Id' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: RestDriverOrderDTO,
  })
  @Get('order/:id')
  @Role(['Driver'])
  async getOrderForDriver(
    @AuthUser() userInfo: UserInfoProjection,
    @Param() { id: orderId }: OrderActionInput,
  ): Promise<RestDriverOrderDTO> {
    const order = await this.driverOrderService.getOrder(userInfo, orderId);
    return new RestDriverOrderDTO(order);
  }

  @ApiOperation({ summary: '[Driver] Get order history' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: [RestDriverOrderDTO],
  })
  @Get('order-history')
  @Role(['Driver'])
  async getOrderHistoryForDriver(
    @AuthUser() userInfo: UserInfoProjection,
  ): Promise<RestDriverOrderDTO[]> {
    const orders = await this.driverOrderService.getOrderHistory(userInfo);
    return orders.map((order) => new RestDriverOrderDTO(order));
  }

  @ApiOperation({ summary: '[Driver] Accept order' })
  @ApiParam({ name: 'id', type: String, description: 'Order Id' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: Boolean,
  })
  @Post('order/:id/accept')
  @Role(['Driver'])
  async acceptOrderByDriver(
    @AuthUser() userInfo: UserInfoProjection,
    @Param() { id: orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.driverOrderService.accept(orderId, userInfo);
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
  @Role(['Driver'])
  async rejectOrderByDriver(
    @AuthUser() userInfo: UserInfoProjection,
    @Param() { id: orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.driverOrderService.reject(orderId, userInfo);
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
  @Role(['Driver'])
  async pickUpOrderByDriver(
    @AuthUser() userInfo: UserInfoProjection,
    @Param() { id: orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.driverOrderService.pickup(orderId, userInfo);
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
  @Role(['Driver'])
  async completeDelivery(
    @AuthUser() userInfo: UserInfoProjection,
    @Param() { id: orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.driverOrderService.completeDelivery(orderId, userInfo);
    return true;
  }
}
