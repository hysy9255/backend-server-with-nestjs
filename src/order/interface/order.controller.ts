import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { OwnerEntity } from 'src/user/domain/owner.entity';
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
import { AuthCustomer } from 'src/auth/auth-customer.decorator';
import { CustomerEntity } from 'src/user/domain/customer.entity';
import {
  CreateOrderInput,
  GetOrderInput,
  OrderActionInput,
} from './dtos/order-inputs.dto';
import {
  ClientOrderPreviewDTO,
  ClientOrderSummaryDTO,
  DriverOrderSummaryDTO,
  OwnerOrderSummaryDTO,
} from './dtos/order-outputs.dto';
import { GetRestaurantInput } from 'src/restaurant/interface/dtos/restaurant-inputs.dto';
import { AuthOwner } from 'src/auth/auth-owner.decorator';
import { OwnerOrderService } from '../application/service/ownerOrder.service';
import { DriverOrderService } from '../application/service/driverOrder.service';
import { AuthDriver } from 'src/auth/auth-driver.decorator';
import { DriverEntity } from 'src/user/domain/driver.entity';

@ApiTags('Order - [Client]')
@ApiSecurity('jwt-token')
@Controller('api/client')
export class ClientOrderController {
  constructor(private readonly clientOrderService: ClientOrderService) {}

  @ApiOperation({ summary: '[Client] Create an order' })
  @ApiBody({ type: CreateOrderInput })
  @Post('order')
  @Role(['Client'])
  async createOrder(
    @AuthCustomer() customer: CustomerEntity,
    @Body() createOrderInput: CreateOrderInput,
  ): Promise<boolean> {
    await this.clientOrderService.createOrder(customer, createOrderInput);
    return true;
  }

  @ApiOperation({ summary: '[Client] Get on-going order' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: ClientOrderSummaryDTO,
  })
  @Get('on-going-order')
  @Role(['Client'])
  async getOnGoingOrderForClient(
    @AuthCustomer() customer: CustomerEntity,
  ): Promise<ClientOrderSummaryDTO> {
    return new ClientOrderSummaryDTO(
      await this.clientOrderService.getOnGoingOrder(customer),
    );
  }

  @ApiOperation({ summary: '[Client] Get order history' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: [ClientOrderPreviewDTO],
  })
  @Get('order-history')
  @Role(['Client'])
  async getOrderHistoryForClient(@AuthCustomer() customer: CustomerEntity) {
    const orders = await this.clientOrderService.getOrderHistory(customer);
    return orders.map((order) => new ClientOrderPreviewDTO(order));
  }

  @ApiOperation({ summary: '[Client] Get order by id' })
  @ApiParam({ name: 'id', type: String, description: 'Order Id' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: ClientOrderSummaryDTO,
  })
  @Get('order/:id')
  @Role(['Client'])
  async getOrderForClient(
    @AuthCustomer() customer: CustomerEntity,
    @Param('id') orderId: GetRestaurantInput['id'],
  ): Promise<ClientOrderSummaryDTO> {
    return new ClientOrderSummaryDTO(
      await this.clientOrderService.getOrderSummaryForClient(customer, orderId),
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
    type: [OwnerOrderSummaryDTO],
  })
  @Get('orders')
  @Role(['Owner'])
  async getOrdersForOwner(
    @AuthOwner() owner: OwnerEntity,
  ): Promise<OwnerOrderSummaryDTO[]> {
    const orders = await this.ownerOrderService.getOrders(owner);
    return orders.map((order) => new OwnerOrderSummaryDTO(order));
  }

  @ApiOperation({ summary: '[Owner] Get order by id' })
  @ApiParam({ name: 'id', type: String, description: 'Order Id' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: OwnerOrderSummaryDTO,
  })
  @Get('order/:id')
  @Role(['Owner'])
  async getOrderForOwner(
    @AuthOwner() owner: OwnerEntity,
    @Param('id') orderId: GetOrderInput['orderId'],
  ): Promise<OwnerOrderSummaryDTO> {
    const order = await this.ownerOrderService.getOrder(owner, orderId);
    return new OwnerOrderSummaryDTO(order);
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
    @AuthOwner() owner: OwnerEntity,
    @Param('id') orderId: OrderActionInput['orderId'],
  ): Promise<boolean> {
    await this.ownerOrderService.acceptOrder(orderId, owner);
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
    @AuthOwner() owner: OwnerEntity,
    @Param('id') orderId: OrderActionInput['orderId'],
  ): Promise<boolean> {
    await this.ownerOrderService.rejectOrder(orderId, owner);
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
    @AuthOwner() owner: OwnerEntity,
    @Param('id') orderId: OrderActionInput['orderId'],
  ): Promise<boolean> {
    await this.ownerOrderService.markOrderAsReady(orderId, owner);
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
    type: [DriverOrderSummaryDTO],
  })
  @Get('orders')
  @Role(['Delivery'])
  async getOrdersForDriver(
    @AuthDriver() driver: DriverEntity,
  ): Promise<DriverOrderSummaryDTO[]> {
    const orders = await this.driverOrderService.getOrdersForDriver(driver);
    return orders.map((order) => new DriverOrderSummaryDTO(order));
  }

  @ApiOperation({ summary: '[Driver] Get order' })
  @ApiParam({ name: 'id', type: String, description: 'Order Id' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: DriverOrderSummaryDTO,
  })
  @Get('order/:id')
  @Role(['Delivery'])
  async getOrderForDriver(
    @AuthDriver() driver: DriverEntity,
    @Param('id') orderId: GetOrderInput['orderId'],
  ): Promise<DriverOrderSummaryDTO> {
    const order = await this.driverOrderService.getOrderForDriver(
      driver,
      orderId,
    );
    return new DriverOrderSummaryDTO(order);
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
    @AuthDriver() driver: DriverEntity,
    @Param('id') orderId: OrderActionInput['orderId'],
  ): Promise<boolean> {
    await this.driverOrderService.acceptOrder(orderId, driver);
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
    @AuthDriver() driver: DriverEntity,
    @Param('id') orderId: OrderActionInput['orderId'],
  ): Promise<boolean> {
    await this.driverOrderService.rejectOrder(orderId, driver);
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
    @AuthDriver() driver: DriverEntity,
    @Param('id') orderId: OrderActionInput['orderId'],
  ): Promise<boolean> {
    await this.driverOrderService.pickupOrder(orderId, driver);
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
    @AuthDriver() driver: DriverEntity,
    @Param('id') orderId: OrderActionInput['orderId'],
  ): Promise<boolean> {
    await this.driverOrderService.completeDelivery(orderId, driver);
    return true;
  }
}
