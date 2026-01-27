import { Controller, Get, Param } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ShippingMethodService } from '../services/shipping-method.service'

@ApiTags('WooCommerce Shipping Methods - Phương thức giao hàng')
@Controller('integrations/woocommerce/shipping/methods')
export class ShippingMethodController {
  constructor(private readonly shippingMethodService: ShippingMethodService) {}

  @Get(':storeId')
  @ApiOperation({ summary: 'List all shipping methods (Liệt kê tất cả phương thức giao hàng)' })
  /**
   * Lấy danh sách tất cả các phương thức giao hàng có sẵn (ví dụ: flat_rate, free_shipping, local_pickup).
   */
  async listAll(@Param('storeId') storeId: number) {
    return this.shippingMethodService.listAll(storeId)
  }

  @Get(':storeId/:id')
  @ApiOperation({ summary: 'Retrieve a shipping method (Lấy chi tiết phương thức giao hàng)' })
  /**
   * Xem thông tin chi tiết của một phương thức giao hàng cụ thể.
   */
  async retrieve(@Param('storeId') storeId: number, @Param('id') id: string) {
    return this.shippingMethodService.retrieve(storeId, id)
  }
}
