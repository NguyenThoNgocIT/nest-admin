import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { FastifyReply } from 'fastify'

import { AuthUser } from '~/modules/auth/decorators/auth-user.decorator'
import { Public } from '~/modules/auth/decorators/public.decorator'
import { JwtAuthGuard } from '~/modules/auth/guards/jwt-auth.guard'

import { ShopifyAdminService } from '../services/shopify-admin.service'
import { ShopifyOAuthService } from '../services/shopify-oauth.service'

@ApiTags('Integration - Shopify')
@Controller('integrations/shopify')
export class ShopifyController {
  constructor(
    private readonly shopifyOAuthService: ShopifyOAuthService,
    private readonly shopifyAdminService: ShopifyAdminService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('connect')
  @ApiOperation({
    summary: 'Bắt đầu quy trình kết nối Shopify Store (OAuth)',
  })
  async connect(
    @Query('shop') shop: string,
    @Res() res: FastifyReply,
    @AuthUser() user: IAuthUser,
  ) {
    const url = await this.shopifyOAuthService.generateAuthUrl(
      shop,
      user.uid,
    )

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

    // Nếu có FRONTEND_URL thì redirect về frontend
    if (process.env.FRONTEND_URL) {
      const successUrl = `${process.env.FRONTEND_URL}/integrations/shopify?status=success&shop=${shop}`
      return res.status(302).redirect(successUrl)
    }

    // Fallback: trả về trang HTML đơn giản
    return res.type('text/html').send(`
      <html>
        <body>
          <h1>Installation Successful!</h1>
          <p>Has updated store: ${shop}</p>
          <script>
            setTimeout(function () {
              window.location.href = "https://${shop}/admin/apps";
            }, 3000);
          </script>
        </body>
      </html>
    `)
  }

  @UseGuards(JwtAuthGuard)
  @Get('shop-info')
  @ApiOperation({ summary: 'Lấy thông tin shop bằng GraphQL' })
  async getShopInfo(
    @Query('shop') shop: string,
    @AuthUser() user: IAuthUser,
  ) {
    const shopInfo = await this.shopifyAdminService.getShopInfo(shop)
    return { data: shopInfo }
  }

  @UseGuards(JwtAuthGuard)
  @Get('products')
  @ApiOperation({ summary: 'Lấy danh sách products bằng GraphQL' })
  async getProducts(
    @Query('shop') shop: string,
    @Query('limit') limit = 10,
    @Query('q') q?: string,
    @AuthUser() user: IAuthUser,
  ) {
    const products = await this.shopifyAdminService.listProducts(
      shop,
      Number(limit),
      q,
    )

    return { data: products }
  }

  @UseGuards(JwtAuthGuard)
  @Post('products')
  @ApiOperation({ summary: 'Tạo product trên Shopify bằng GraphQL' })
  async createProduct(
    @Query('shop') shop: string,
    @Body() body: any,
    @AuthUser() user: IAuthUser,
  ) {
    const product = await this.shopifyAdminService.createProduct(
      shop,
      body,
    )

    return { data: product }
  }

  @UseGuards(JwtAuthGuard)
  @Get('orders')
  @ApiOperation({ summary: 'Lấy danh sách orders bằng GraphQL' })
  async getOrders(
    @Query('shop') shop: string,
    @Query('limit') limit = 10,
    @Query('q') q?: string,
    @AuthUser() user: IAuthUser,
  ) {
    const orders = await this.shopifyAdminService.listOrders(
      shop,
      Number(limit),
      q,
    )

    return { data: orders }
  }
}
