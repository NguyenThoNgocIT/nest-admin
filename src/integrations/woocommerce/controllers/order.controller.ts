import { Controller, Get, Param, Query } from '@nestjs/common'
import { SyncOrderDto } from '../dto/sync-order.dto'
import { OrderService } from '../services/order.service'

@Controller('integrations/woocommerce/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get(':storeId')
  async findAll(@Param('storeId') storeId: number, @Query() query: SyncOrderDto) {
    return this.orderService.getOrders(storeId, query)
  }

  @Get(':storeId/:id')
  async findOne(@Param('storeId') storeId: number, @Param('id') id: number) {
    return this.orderService.getOrder(storeId, id)
  }
}
