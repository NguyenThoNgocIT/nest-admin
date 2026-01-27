import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { BatchWebhookDto, CreateWebhookDto, UpdateWebhookDto } from '../dto/webhook.dto'
import { WebhookService } from '../services/webhook.service'

@ApiTags('WooCommerce Webhooks - Quản lý Webhooks')
@Controller('integrations/woocommerce/webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post(':storeId')
  @ApiOperation({ summary: 'Create a webhook (Tạo webhook mới)' })
  /**
   * Tạo một webhook mới để lắng nghe các sự kiện từ WooCommerce.
   */
  async create(@Param('storeId') storeId: number, @Body() data: CreateWebhookDto) {
    return this.webhookService.create(storeId, data)
  }

  @Post(':storeId/batch')
  @ApiOperation({ summary: 'Batch update webhooks (Xử lý webhook hàng loạt)' })
  /**
   * Tạo, cập nhật hoặc xóa hàng loạt webhook.
   */
  async batch(@Param('storeId') storeId: number, @Body() data: BatchWebhookDto) {
    return this.webhookService.batch(storeId, data)
  }

  @Get(':storeId')
  @ApiOperation({ summary: 'List all webhooks (Liệt kê tất cả webhook)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'per_page', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', required: false, description: 'Limit result set to webhooks assigned a specific status. Options: all, active, paused and disabled.' })
  /**
   * Lấy danh sách tất cả các webhook đang có trong hệ thống.
   */
  async listAll(@Param('storeId') storeId: number, @Query() query: any) {
    return this.webhookService.listAll(storeId, query)
  }

  @Get(':storeId/:id')
  @ApiOperation({ summary: 'Retrieve a webhook (Lấy chi tiết webhook)' })
  /**
   * Xem chi tiết thông tin của một webhook theo ID.
   */
  async retrieve(@Param('storeId') storeId: number, @Param('id') id: number) {
    return this.webhookService.retrieve(storeId, id)
  }

  @Put(':storeId/:id')
  @ApiOperation({ summary: 'Update a webhook (Cập nhật webhook)' })
  /**
   * Cập nhật thông tin của một webhook (ví dụ: đổi URL, đổi trạng thái).
   */
  async update(
    @Param('storeId') storeId: number,
    @Param('id') id: number,
    @Body() data: UpdateWebhookDto,
  ) {
    return this.webhookService.update(storeId, id, data)
  }

  @Delete(':storeId/:id')
  @ApiOperation({ summary: 'Delete a webhook (Xóa webhook)' })
  @ApiQuery({ name: 'force', required: false, type: Boolean, description: 'Use true whether to permanently delete the webhook, Defaults is false.' })
  /**
   * Xóa một webhook khỏi hệ thống.
   */
  async delete(
    @Param('storeId') storeId: number,
    @Param('id') id: number,
    @Query('force') force: boolean,
  ) {
    return this.webhookService.delete(storeId, id, force)
  }
}
