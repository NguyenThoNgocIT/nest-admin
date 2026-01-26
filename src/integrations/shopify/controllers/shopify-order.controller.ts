import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuthUser } from '~/modules/auth/decorators/auth-user.decorator'
import { JwtAuthGuard } from '~/modules/auth/guards/jwt-auth.guard'
import { ShopifyOrderService } from '../services/shopify-order.service'

@ApiTags('Integration - Shopify Orders')
@Controller('integrations/shopify/orders')
export class ShopifyOrderController {
  constructor(private readonly shopifyOrderService: ShopifyOrderService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách Orders (GraphQL Search)' })
  async getOrders(
    @Query('shop') shop: string,
    @Query('limit') limit = 10,
    @Query('q') q: string | undefined,
    @AuthUser() user: IAuthUser,
  ) {
    const data = await this.shopifyOrderService.listOrders(
      shop,
      Number(limit),
      q,
      user.uid,
    )
    return { data }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết Order' })
  async getOrder(
    @Query('shop') shop: string,
    @Param('id') orderId: string,
    @AuthUser() user: IAuthUser,
  ) {
    // Nếu orderId chỉ là số, cần prefix gid: `gid://shopify/Order/${orderId}`
    // Service hiện tại nhận string ID
    const gid = orderId.startsWith('gid://') ? orderId : `gid://shopify/Order/${orderId}`
    const data = await this.shopifyOrderService.getOrder(shop, gid, user.uid)
    return { data }
  }
}
