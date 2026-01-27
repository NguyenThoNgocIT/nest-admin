import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { AuthUser } from '~/modules/auth/decorators/auth-user.decorator'
import { JwtAuthGuard } from '~/modules/auth/guards/jwt-auth.guard'
import { ShopifyShopService } from '../services/shopify-shop.service'

@ApiTags('Integration - Shopify Shop')
@Controller('integrations/shopify/shop')
export class ShopifyShopController {
  constructor(private readonly shopifyShopService: ShopifyShopService) {}

  @UseGuards(JwtAuthGuard)
  @Get('info')
  @ApiOperation({ summary: 'Lấy thông tin chung của Store (Shop Info)' })
  async getShopInfo(
    @Query('shop') shop: string,
    @AuthUser() user: IAuthUser,
  ) {
    const data = await this.shopifyShopService.getShopInfo(shop, user.uid)
    return { data }
  }
}
