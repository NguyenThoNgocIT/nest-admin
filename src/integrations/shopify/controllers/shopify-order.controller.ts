import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
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

  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  @ApiOperation({ summary: 'Lấy dữ liệu Orders cho Dashboard (Recent + Count)' })
  async getDashboardOrders(
    @Query('shop') shop: string,
    @Query('limit') limit = 5,
    @AuthUser() user: IAuthUser,
  ) {
    const data = await this.shopifyOrderService.listOrdersForDashboard(shop, Number(limit), user.uid)
    return { data }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/close')
  @ApiOperation({ summary: 'Đóng Order (Archive)' })
  async closeOrder(
    @Param('id') id: string,
    @Body('shop') shop: string,
    @AuthUser() user: IAuthUser,
  ) {
    const gid = id.startsWith('gid://') ? id : `gid://shopify/Order/${id}`
    const result = await this.shopifyOrderService.closeOrder(shop, gid, user.uid)
    return { data: result }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/reopen')
  @ApiOperation({ summary: 'Mở lại Order (Unarchive)' })
  async reopenOrder(
    @Param('id') id: string,
    @Body('shop') shop: string,
    @AuthUser() user: IAuthUser,
  ) {
    const gid = id.startsWith('gid://') ? id : `gid://shopify/Order/${id}`
    const result = await this.shopifyOrderService.reopenOrder(shop, gid, user.uid)
    return { data: result }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/cancel')
  @ApiOperation({ summary: 'Hủy Order' })
  async cancelOrder(
    @Param('id') id: string,
    @Body('shop') shop: string,
    @Body('reason') reason: string,
    @AuthUser() user: IAuthUser,
  ) {
    const gid = id.startsWith('gid://') ? id : `gid://shopify/Order/${id}`
    const result = await this.shopifyOrderService.cancelOrder(shop, gid, reason, user.uid)
    return { data: result }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/fulfill')
  @ApiOperation({ summary: 'Fulfill Order (Partial/Full)' })
  async fulfillOrder(
    @Param('id') id: string,
    @Body() body: { shop: string, fulfillmentOrderLineItems: any[], trackingUrl?: string, trackingCompany?: string, trackingNumber?: string },
    @AuthUser() user: IAuthUser,
  ) {
    const { shop, fulfillmentOrderLineItems, trackingUrl, trackingCompany, trackingNumber } = body

    // Check required params
    if (!fulfillmentOrderLineItems || fulfillmentOrderLineItems.length === 0) {
      // In a real app, you might want to auto-fetch fulfillmentOrderLineItems if missing,
      // but simpler to require them from client or use default all.
      // For now, let's assume client sends them.
      throw new Error('Missing fulfillmentOrderLineItems')
    }

    const trackingInfo = trackingNumber ? { url: trackingUrl, company: trackingCompany, number: trackingNumber } : undefined

    // The service method expects `fulfillmentOrderId`, but `id` param here is likely `orderId`.
    // Fulfillment mutation requires `fulfillmentOrderId` (not Order ID).
    // Usually, you fetch Order -> get FulfillmentOrders -> fulfill one of them.
    // However, for simplicity here, let's assume the client passes the proper ID in body or we mistakenly use order ID in URL.
    // WAIT, `orderFulfillmentV2` takes `fulfillmentOrderLineItems` which contains `fulfillmentOrderId`.
    // The service method signature is:
    // fulfillOrder(shop: string, fulfillmentOrderLineItems: any[], trackingInfo?: ..., userId: string)

    // So the `:id` in URL is mostly for REST consistency, but the payload drives logic.
    const result = await this.shopifyOrderService.fulfillOrder(
      shop,
      fulfillmentOrderLineItems,
      trackingInfo,
      user.uid,
    )
    return { data: result }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/refund')
  @ApiOperation({ summary: 'Refund Order' })
  async createRefund(
    @Param('id') id: string,
    @Body() body: { shop: string, refundLineItems: any[], transactions: any[], note?: string, notify?: boolean },
    @AuthUser() user: IAuthUser,
  ) {
    const gid = id.startsWith('gid://') ? id : `gid://shopify/Order/${id}`
    const { shop, refundLineItems, transactions, note, notify } = body

    const result = await this.shopifyOrderService.createRefund(
      shop,
      gid,
      refundLineItems,
      transactions, // transactions need `orderId`, `gateway`, `amount`, `kind`, `parentId`... usually just amount & kind for simple cases if Shopify allows inferred.
      // But `refundCreate` allows specifying transactions to refund.
      // If empty, it's just a return without money back?
      note,
      notify,
      user.uid,
    )
    return { data: result }
  }
}
