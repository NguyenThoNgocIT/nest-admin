import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { FastifyReply } from 'fastify'

import { AuthUser } from '~/modules/auth/decorators/auth-user.decorator'
import { Public } from '~/modules/auth/decorators/public.decorator'
import { JwtAuthGuard } from '~/modules/auth/guards/jwt-auth.guard'
import { ShopifyOAuthService } from '../services/shopify-oauth.service'

@ApiTags('Integration - Shopify')
@Controller('integrations/shopify')
export class ShopifyController {
  constructor(private readonly shopifyOAuthService: ShopifyOAuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('connect')
  @ApiOperation({ summary: 'Bắt đầu quy trình kết nối Shopify Store (OAuth)' })
  async connect(
    @Query('shop') shop: string,
    @Res() res: FastifyReply,
    @AuthUser() user: IAuthUser,
  ) {
    const url = await this.shopifyOAuthService.generateAuthUrl(shop, user.uid)
    return res.status(302).redirect(url)
  }

  @Public()
  @Get('oauth/callback')
  @ApiOperation({ summary: 'Shopify OAuth Callback' })
  async callback(
    @Query('shop') shop: string,
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: FastifyReply,
  ) {
    await this.shopifyOAuthService.handleCallback(shop, code, state)

    // Nếu có FRONTEND_URL thì redirect về đó, ngược lại redirect về trang Apps của store
    if (process.env.FRONTEND_URL) {
      const successUrl = `${process.env.FRONTEND_URL}/integrations/shopify?status=success&shop=${shop}`
      return res.status(302).redirect(successUrl)
    }

    // Fallback: Redirect về Shopify Admin
    // const adminUrl = `https://${shop}/admin/apps`
    // Hoặc trả về trang HTML báo thành công đơn giản
    return res.type('text/html').send(`
      <html>
        <body>
          <h1>Installation Successful!</h1>
          <p>Has updated store: ${shop}</p>
          <script>
            setTimeout(function() {
              window.location.href = "https://${shop}/admin/apps";
            }, 3000);
          </script>
        </body>
      </html>
    `)
  }
}
