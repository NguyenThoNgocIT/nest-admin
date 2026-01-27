import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateOrderRefundDto } from '../dto/order-refund.dto'
import { OrderRefundService } from '../services/order-refund.service'

@ApiTags('WooCommerce Order Refunds - Quản lý hoàn tiền')
@Controller('integrations/woocommerce/orders/:storeId/:orderId/refunds')
export class OrderRefundController {
  constructor(private readonly refundService: OrderRefundService) {}

  @Post()
  @ApiOperation({ summary: 'Create a refund for an order' })
  async createRefund(
    @Param('storeId') storeId: number,
    @Param('orderId') orderId: number,
    @Body() data: CreateOrderRefundDto,
  ) {
    return this.refundService.createRefund(storeId, orderId, data)
  }

  @Get()
  @ApiOperation({ summary: 'List all refunds for an order' })
  async getRefunds(
    @Param('storeId') storeId: number,
    @Param('orderId') orderId: number,
  ) {
    return this.refundService.getRefunds(storeId, orderId)
  }

  @Get(':refundId')
  @ApiOperation({ summary: 'Retrieve a specific refund' })
  async getRefund(
    @Param('storeId') storeId: number,
    @Param('orderId') orderId: number,
    @Param('refundId') refundId: number,
  ) {
    return this.refundService.getRefund(storeId, orderId, refundId)
  }

  @Delete(':refundId')
  @ApiOperation({ summary: 'Delete a refund' })
  async deleteRefund(
    @Param('storeId') storeId: number,
    @Param('orderId') orderId: number,
    @Param('refundId') refundId: number,
  ) {
    return this.refundService.deleteRefund(storeId, orderId, refundId)
  }
}
