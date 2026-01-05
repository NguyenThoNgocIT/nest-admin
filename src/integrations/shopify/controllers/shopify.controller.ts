import { Controller, Get, Query, Res } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

import { Public } from '~/modules/auth/decorators/public.decorator'
import { ShopifyOAuthService } from '../services/shopify-oauth.service'

@ApiTags('Integration - Shopify')
@Controller('integrations/shopify')
export class ShopifyController {
  constructor(private readonly shopifyOAuthService: ShopifyOAuthService) {}

  @Get('connect')
  @ApiOperation({ summary: 'Bắt đầu quy trình kết nối Shopify Store (OAuth)' })
  async connect(@Query('shop') shop: string, @Res() res: Response) {
    const url = await this.shopifyOAuthService.generateAuthUrl(shop)
    return res.redirect(url)
  }

  @Public()
  @Get('oauth/callback')
  @ApiOperation({ summary: 'Shopify OAuth Callback' })
  async callback(
    @Query('shop') shop: string,
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    await this.shopifyOAuthService.handleCallback(shop, code, state)

    // Redirect về trang quản lý của Admin sau khi kết nối thành công
    // Cần config URL này trong env hoặc hardcode tạm
    const successUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/integrations/shopify?status=success&shop=${shop}`
    return res.redirect(successUrl)
  }
}
