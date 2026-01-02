import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { SyncOrderDto } from '../dto/sync-order.dto'
import { OrderService } from '../services/order.service'

@ApiTags('WooCommerce Orders - Quản lý đơn hàng')
@Controller('integrations/woocommerce/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get(':storeId')
  @ApiOperation({ summary: 'Lấy danh sách đơn hàng từ WooCommerce' })
  async findAll(@Param('storeId') storeId: number, @Query() query: SyncOrderDto) {
    return this.orderService.getOrders(storeId, query)
  }

  @Get(':storeId/:id')
  @ApiOperation({ summary: 'Lấy chi tiết đơn hàng từ WooCommerce' })
  async findOne(@Param('storeId') storeId: number, @Param('id') id: number) {
    return this.orderService.getOrder(storeId, id)
  }
}
