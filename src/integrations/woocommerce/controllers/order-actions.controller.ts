import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateOrderNoteDto, SendOrderDetailsDto, SendOrderEmailDto } from '../dto/order-actions.dto'
import { OrderActionsService } from '../services/order-actions.service'

@ApiTags('WooCommerce Order Actions - Hành động đơn hàng')
@Controller('integrations/woocommerce/orders')
export class OrderActionsController {
  constructor(private readonly orderActionsService: OrderActionsService) {}

  // Order Actions
  @Post(':storeId/:orderId/actions/send-order-details')
  @ApiOperation({ summary: 'Gửi chi tiết đơn hàng đến email khách hàng' })
  async sendOrderDetails(
    @Param('storeId') storeId: number,
    @Param('orderId') orderId: number,
    @Body() data: SendOrderDetailsDto,
  ) {
    return this.orderActionsService.sendOrderDetails(storeId, orderId, data)
  }

  @Post(':storeId/:orderId/actions/send-email')
  @ApiOperation({ summary: 'Gửi email template cụ thể cho khách hàng' })
  async sendOrderEmail(
    @Param('storeId') storeId: number,
    @Param('orderId') orderId: number,
    @Body() data: SendOrderEmailDto,
  ) {
    return this.orderActionsService.sendOrderEmail(storeId, orderId, data)
  }

  @Get(':storeId/:orderId/actions/email-templates')
  @ApiOperation({ summary: 'Lấy danh sách email template khả dụng cho đơn hàng' })
  async getEmailTemplates(@Param('storeId') storeId: number, @Param('orderId') orderId: number) {
    return this.orderActionsService.getEmailTemplates(storeId, orderId)
  }

  // Order Notes
  @Post(':storeId/:orderId/notes')
  @ApiOperation({ summary: 'Tạo ghi chú cho đơn hàng' })
  async createOrderNote(
    @Param('storeId') storeId: number,
    @Param('orderId') orderId: number,
    @Body() data: CreateOrderNoteDto,
  ) {
    return this.orderActionsService.createOrderNote(storeId, orderId, data)
  }

  @Get(':storeId/:orderId/notes')
  @ApiOperation({ summary: 'Lấy danh sách ghi chú của đơn hàng' })
  async getOrderNotes(
    @Param('storeId') storeId: number,
    @Param('orderId') orderId: number,
    @Query() params: any,
  ) {
    return this.orderActionsService.getOrderNotes(storeId, orderId, params)
  }

  @Get(':storeId/:orderId/notes/:noteId')
  @ApiOperation({ summary: 'Lấy chi tiết một ghi chú' })
  async getOrderNote(
    @Param('storeId') storeId: number,
    @Param('orderId') orderId: number,
    @Param('noteId') noteId: number,
  ) {
    return this.orderActionsService.getOrderNote(storeId, orderId, noteId)
  }

  @Delete(':storeId/:orderId/notes/:noteId')
  @ApiOperation({ summary: 'Xóa ghi chú của đơn hàng' })
  async deleteOrderNote(
    @Param('storeId') storeId: number,
    @Param('orderId') orderId: number,
    @Param('noteId') noteId: number,
    @Query('force') force: boolean,
  ) {
    return this.orderActionsService.deleteOrderNote(storeId, orderId, noteId, force)
  }

  @Post(':storeId/:orderId/notes/sync')
  @ApiOperation({ summary: 'Đồng bộ ghi chú của đơn hàng về database' })
  async syncOrderNotes(@Param('storeId') storeId: number, @Param('orderId') orderId: number) {
    return this.orderActionsService.syncOrderNotes(storeId, orderId)
  }
}
