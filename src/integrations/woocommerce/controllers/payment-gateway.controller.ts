import { Body, Controller, Get, Param, Put } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { UpdatePaymentGatewayDto } from '../dto/payment-gateway.dto'
import { PaymentGatewayService } from '../services/payment-gateway.service'

@ApiTags('WooCommerce Payment Gateways - Quản lý Cổng thanh toán')
@Controller('integrations/woocommerce/payment_gateways')
export class PaymentGatewayController {
  constructor(private readonly paymentGatewayService: PaymentGatewayService) {}

  @Get(':storeId')
  @ApiOperation({ summary: 'List all payment gateways (Liệt kê tất cả cổng thanh toán)' })
  /**
   * Lấy danh sách tất cả các cổng thanh toán (ví dụ: PayPal, BACS, Cash on Delivery).
   */
  async listAll(@Param('storeId') storeId: number) {
    return this.paymentGatewayService.listAll(storeId)
  }

  @Get(':storeId/:id')
  @ApiOperation({ summary: 'Retrieve a payment gateway (Lấy chi tiết cổng thanh toán)' })
  /**
   * Xem thông tin chi tiết và cài đặt của một cổng thanh toán cụ thể.
   */
  async retrieve(@Param('storeId') storeId: number, @Param('id') id: string) {
    return this.paymentGatewayService.retrieve(storeId, id)
  }

  @Put(':storeId/:id')
  @ApiOperation({ summary: 'Update a payment gateway (Cập nhật cổng thanh toán)' })
  /**
   * Cập nhật thông tin cổng thanh toán, ví dụ: bật/tắt (enabled), thay đổi tiêu đề (title), hoặc cập nhật settings.
   */
  async update(
    @Param('storeId') storeId: number,
    @Param('id') id: string,
    @Body() data: UpdatePaymentGatewayDto,
  ) {
    return this.paymentGatewayService.update(storeId, id, data)
  }
}
