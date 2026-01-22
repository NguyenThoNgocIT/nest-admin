import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateOrderDto, UpdateOrderDto } from '../dto/create-order.dto'
import { SyncOrderDto } from '../dto/sync-order.dto'
import { OrderService } from '../services/order.service'

@ApiTags('WooCommerce Orders - Quản lý đơn hàng')
@Controller('integrations/woocommerce/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post(':storeId')
  @ApiOperation({ summary: 'Tạo đơn hàng mới trên WooCommerce' })
  async create(@Param('storeId') storeId: number, @Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(storeId, createOrderDto)
  }

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

  @Put(':storeId/:id')
  @ApiOperation({ summary: 'Cập nhật đơn hàng trên WooCommerce' })
  async update(
    @Param('storeId') storeId: number,
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.updateOrder(storeId, id, updateOrderDto)
  }

  @Delete(':storeId/:id')
  @ApiOperation({ summary: 'Xóa đơn hàng trên WooCommerce' })
  async remove(@Param('storeId') storeId: number, @Param('id') id: number, @Query('force') force: boolean) {
    return this.orderService.deleteOrder(storeId, id, force)
  }

  @Post(':storeId/sync')
  @ApiOperation({ summary: 'Đồng bộ đơn hàng từ WooCommerce về database' })
  async sync(@Param('storeId') storeId: number) {
    return this.orderService.syncOrders(storeId)
  }
}
