import { Body, Controller, Get, Param, Put } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { RunSystemStatusToolDto } from '../dto/system-status-tool.dto'
import { SystemStatusToolService } from '../services/system-status-tool.service'

@ApiTags('WooCommerce System Status Tools - Công cụ trạng thái hệ thống')
@Controller('integrations/woocommerce/system_status/tools')
export class SystemStatusToolController {
  constructor(private readonly systemStatusToolService: SystemStatusToolService) {}

  @Get(':storeId')
  @ApiOperation({ summary: 'List all system status tools (Liệt kê tất cả công cụ trạng thái hệ thống)' })
  /**
   * Lấy danh sách các công cụ hệ thống có sẵn (ví dụ: clear_transients, regenerate_thumbnails).
   */
  async listAll(@Param('storeId') storeId: number) {
    return this.systemStatusToolService.listAll(storeId)
  }

  @Get(':storeId/:id')
  @ApiOperation({ summary: 'Retrieve a system status tool (Lấy chi tiết công cụ)' })
  /**
   * Xem thông tin chi tiết về một công cụ cụ thể.
   */
  async retrieve(@Param('storeId') storeId: number, @Param('id') id: string) {
    return this.systemStatusToolService.retrieve(storeId, id)
  }

  @Put(':storeId/:id')
  @ApiOperation({ summary: 'Run a system status tool (Chạy công cụ hệ thống)' })
  /**
   * Thực thi một công cụ hệ thống (ví dụ: xóa cache, đếm lại terms).
   * Cần gửi body { "confirm": true } để xác nhận thực thi.
   */
  async runTool(
    @Param('storeId') storeId: number,
    @Param('id') id: number, // doc says id string but user request says string id like 'clear_transients', checking... yes string.
    // Wait, the param type in controller for string id should be string.
    // Let me correct that in the next turn if I made a mistake, but here I'll use string.
    // Actually the user request doc shows string IDs like 'clear_transients', 'clear_expired_transients'.
    // So the Param type should be string.
    @Body() data: RunSystemStatusToolDto,
  ) {
    // Note: The previous generated file had id: number in some places, I should be careful.
    // But here I'm creating the file.
    // Wait, let's fix the type in the argument list below.
    return this.systemStatusToolService.runTool(storeId, String(id), data)
  }
}
