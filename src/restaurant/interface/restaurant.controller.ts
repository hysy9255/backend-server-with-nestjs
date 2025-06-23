import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { RestaurantService } from '../application/service/restaurant.service';
import {
  CreateRestaurantInput,
  GetRestaurantInput,
} from './dtos/restaurant-inputs.dto';
import { OwnerEntity } from 'src/user/domain/owner.entity';
import { Role } from 'src/auth/role.decorator';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { RestaurantSummaryDTO } from './dtos/restaurant-outputs.dto';

@ApiSecurity('jwt-token')
@Controller('api/restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @ApiOperation({
    summary: '[Owner] Create a restaurant',
  })
  @ApiBody({ type: CreateRestaurantInput })
  @Post('restaurant')
  @Role(['Owner'])
  async createRestaurant(
    @AuthUser() owner: OwnerEntity,
    @Body() createRestaurantInput: CreateRestaurantInput,
  ): Promise<boolean> {
    await this.restaurantService.createRestaurant(owner, createRestaurantInput);
    return true;
  }

  @ApiOperation({ summary: '[Any] Get restaurant summary by id' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Restaurant Id',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: RestaurantSummaryDTO,
  })
  @Get(':id')
  @Role(['Any'])
  async restaurant(
    @Param('id') restaurantId: GetRestaurantInput['id'],
  ): Promise<RestaurantSummaryDTO> {
    return new RestaurantSummaryDTO(
      await this.restaurantService.getRestaurantSummaryById(restaurantId),
    );
  }

  @ApiOperation({ summary: '[Any] Get all restaurant summaries' }) // Summary description
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: [RestaurantSummaryDTO],
  })
  @Get()
  @Role(['Any'])
  async getAllRestaurants(): Promise<RestaurantSummaryDTO[]> {
    const restaurants = await this.restaurantService.getRestaurantSummaries();
    return restaurants.map(
      (restaurant) => new RestaurantSummaryDTO(restaurant),
    );
  }
}
