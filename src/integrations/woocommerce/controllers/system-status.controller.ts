import { Controller, Get, Param } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { SystemStatusService } from '../services/system-status.service'

@ApiTags('WooCommerce System Status - Trạng thái hệ thống')
@Controller('integrations/woocommerce/system_status')
export class SystemStatusController {
  constructor(private readonly systemStatusService: SystemStatusService) {}

  @Get(':storeId')
  @ApiOperation({ summary: 'List all system status items (Liệt kê tất cả hạng mục trạng thái hệ thống)' })
  /**
   * Xem thông tin trạng thái hệ thống (System Status) của cửa hàng WooCommerce.
   * Bao gồm môi trường, cơ sở dữ liệu, plugin đang kích hoạt, theme, cài đặt, bảo mật và các trang.
   */
  async listAll(@Param('storeId') storeId: number) {
    return this.systemStatusService.listAll(storeId)
  }
}
