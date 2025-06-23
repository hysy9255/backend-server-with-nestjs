import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { AuthUser } from 'src/auth/auth-user.decorator';

import { OwnerEntity } from 'src/user/domain/owner.entity';
import { Role } from 'src/auth/role.decorator';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { RestaurantService } from 'src/restaurant/application/service/restaurant.service';
import { ClientOrderService } from '../application/service/clientOrder.service';
import { AuthCustomer } from 'src/auth/auth-customer.decorator';
import { CustomerEntity } from 'src/user/domain/customer.entity';
import { create } from 'domain';
import {
  CreateOrderInput,
  GetOrderInput,
  OrderActionInput,
} from './dtos/order-inputs.dto';
import { ClientOrderSummaryProjection } from '../infrastructure/repositories/query/projections/order.projection';
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

@ApiSecurity('jwt-token')
@Controller('api/order')
export class OrderController {
  constructor(
    private readonly clientOrderService: ClientOrderService,
    private readonly ownerOrderService: OwnerOrderService,
    private readonly driverOrderService: DriverOrderService,
  ) {}

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
    type: ClientOrderSummaryProjection,
  })
  @Get('on-going-order')
  @Role(['Client'])
  async getOnGoingOrderForClient(
    @AuthCustomer() customer: CustomerEntity,
  ): Promise<ClientOrderSummaryProjection> {
    return await this.clientOrderService.getOnGoingOrder(customer);
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
  @Role(['Client'])
  async getOrderForClient(
    @AuthCustomer() customer: CustomerEntity,
    @Param('id') orderId: GetRestaurantInput['id'],
  ): Promise<ClientOrderSummaryDTO> {
    return new ClientOrderSummaryDTO(
      await this.clientOrderService.getOrderSummaryForClient(customer, orderId),
    );
  }

  @ApiOperation({ summary: '[Owner] Get orders for owner' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: [OwnerOrderSummaryDTO],
  })
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
  @Role(['Owner'])
  async getOrderForOwner(
    @AuthOwner() owner: OwnerEntity,
    @Param('id') orderId: GetOrderInput['orderId'],
  ): Promise<OwnerOrderSummaryDTO> {
    const order = await this.ownerOrderService.getOrder(owner, orderId);
    return new OwnerOrderSummaryDTO(order);
  }

  @ApiOperation({ summary: '[Owner] Accept order' })
  @ApiBody({ type: OrderActionInput })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: Boolean,
  })
  @Role(['Owner'])
  async acceptOrderByOwner(
    @AuthOwner() owner: OwnerEntity,
    @Body() { orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.ownerOrderService.acceptOrder(orderId, owner);
    return true;
  }

  @ApiOperation({ summary: '[Owner] Reject order' })
  @ApiBody({ type: OrderActionInput })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: Boolean,
  })
  @Role(['Owner'])
  async rejectOrderByOwner(
    @AuthOwner() owner: OwnerEntity,
    @Body() { orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.ownerOrderService.rejectOrder(orderId, owner);
    return true;
  }

  @ApiOperation({ summary: '[Owner] Mark order as ready' })
  @ApiBody({ type: OrderActionInput })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: Boolean,
  })
  @Role(['Owner'])
  async markOrderAsReadyByOwner(
    @AuthOwner() owner: OwnerEntity,
    @Body() { orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.ownerOrderService.markOrderAsReady(orderId, owner);
    return true;
  }

  @ApiOperation({ summary: '[Driver] Get orders' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: [DriverOrderSummaryDTO],
  })
  @Role(['Delivery'])
  async getOrdersForDriver(
    @AuthDriver() driver: DriverEntity,
  ): Promise<DriverOrderSummaryDTO[]> {
    const orders = await this.driverOrderService.getOrdersForDriver(driver);
    return orders.map((order) => new DriverOrderSummaryDTO(order));
  }

  @ApiOperation({ summary: '[Driver] Get order' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: DriverOrderSummaryDTO,
  })
  @Role(['Delivery'])
  async getOrderForDriver(
    @AuthDriver() driver: DriverEntity,
    @Body() { orderId }: GetOrderInput,
  ): Promise<DriverOrderSummaryDTO> {
    const order = await this.driverOrderService.getOrderForDriver(
      driver,
      orderId,
    );
    return new DriverOrderSummaryDTO(order);
  }

  @ApiOperation({ summary: '[Driver] Accept order' })
  @ApiBody({ type: OrderActionInput })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: Boolean,
  })
  @Role(['Delivery'])
  async acceptOrderByDriver(
    @AuthDriver() driver: DriverEntity,
    @Body() { orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.driverOrderService.acceptOrder(orderId, driver);
    return true;
  }

  @ApiOperation({ summary: '[Driver] Reject order' })
  @ApiBody({ type: OrderActionInput })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: Boolean,
  })
  @Role(['Delivery'])
  async rejectOrderByDriver(
    @AuthDriver() driver: DriverEntity,
    @Body() { orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.driverOrderService.rejectOrder(orderId, driver);
    return true;
  }

  @ApiOperation({ summary: '[Driver] Pick up order' })
  @ApiBody({ type: OrderActionInput })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: Boolean,
  })
  @Role(['Delivery'])
  async pickUpOrderByDriver(
    @AuthDriver() driver: DriverEntity,
    @Body() { orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.driverOrderService.pickupOrder(orderId, driver);
    return true;
  }

  @ApiOperation({ summary: '[Driver] Complete delivery' })
  @ApiBody({ type: OrderActionInput })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: Boolean,
  })
  @Role(['Delivery'])
  async completeDelivery(
    @AuthDriver() driver: DriverEntity,
    @Body() { orderId }: OrderActionInput,
  ): Promise<boolean> {
    await this.driverOrderService.completeDelivery(orderId, driver);
    return true;
  }
}
