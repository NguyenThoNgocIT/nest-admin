import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { OrderRefundService } from '../services/order-refund.service'

@ApiTags('WooCommerce Refunds - Quản lý hoàn tiền chung')
@Controller('integrations/woocommerce/refunds')
export class RefundController {
  constructor(private readonly refundService: OrderRefundService) {}

  @Get(':storeId')
  @ApiOperation({ summary: 'List all refunds from store (Liệt kê tất cả hoàn tiền)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'per_page', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'after', required: false, description: 'Limit response to resources published after a given ISO8601 compliant date.' })
  @ApiQuery({ name: 'before', required: false, description: 'Limit response to resources published before a given ISO8601 compliant date.' })
  @ApiQuery({ name: 'exclude', required: false, description: 'Ensure result set excludes specific IDs.' })
  @ApiQuery({ name: 'include', required: false, description: 'Limit result set to specific IDs.' })
  @ApiQuery({ name: 'offset', required: false, description: 'Offset the result set by a specific number of items.' })
  @ApiQuery({ name: 'order', required: false, description: 'Order sort attribute ascending or descending.', enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'orderby', required: false, description: 'Sort collection by object attribute.', enum: ['date', 'id', 'include', 'title', 'slug', 'modified'] })
  @ApiQuery({ name: 'parent', required: false, description: 'Limit result set to those of particular parent IDs.' })
  @ApiQuery({ name: 'parent_exclude', required: false, description: 'Limit result set to all items except those of a particular parent ID.' })
  /**
   * Liệt kê tất cả các khoản hoàn tiền từ cửa hàng, bất kể chúng thuộc đơn hàng nào.
   * Endpoint này trả về danh sách các khoản hoàn tiền (read-only).
   */
  async findAll(@Param('storeId') storeId: number, @Query() query: any) {
    return this.refundService.findAllRefunds(storeId, query)
  }
}
