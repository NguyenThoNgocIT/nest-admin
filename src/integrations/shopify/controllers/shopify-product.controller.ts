import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { AuthUser } from '~/modules/auth/decorators/auth-user.decorator'
import { JwtAuthGuard } from '~/modules/auth/guards/jwt-auth.guard'
import { ShopifyProductService } from '../services/shopify-product.service'

@ApiTags('Integration - Shopify Products')
@Controller('integrations/shopify/products')
export class ShopifyProductController {
  constructor(private readonly shopifyProductService: ShopifyProductService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách Products (GraphQL Search)' })
  async getProducts(
    @Query('shop') shop: string,
    @Query('limit') limit = 10,
    @Query('q') q: string | undefined, // Search query (VD: title:Shirt)
    @AuthUser() user: IAuthUser,
  ) {
    const data = await this.shopifyProductService.listProducts(
      shop,
      Number(limit),
      q,
      user.uid,
    )
    return { data }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết Product' })
  async getProduct(
    @Query('shop') shop: string,
    @Param('id') id: string,
    @AuthUser() user: IAuthUser,
  ) {
    const data = await this.shopifyProductService.getProduct(shop, id, user.uid)
    return { data }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Tạo Product mới' })
  async createProduct(
    @Query('shop') shop: string,
    @Body() body: any, // Nên define DTO cụ thể nếu có thể
    @AuthUser() user: IAuthUser,
  ) {
    const data = await this.shopifyProductService.createProduct(
      shop,
      body,
      user.uid,
    )
    return { data }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật Product' })
  async updateProduct(
    @Query('shop') shop: string,
    @Param('id') id: string,
    @Body() body: any,
    @AuthUser() user: IAuthUser,
  ) {
    // Đảm bảo body có ID
    const payload = { ...body, id: id.startsWith('gid://') ? id : `gid://shopify/Product/${id}` }

    const data = await this.shopifyProductService.updateProduct(
      shop,
      payload,
      user.uid,
    )
    return { data }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Xoá Product' })
  async deleteProduct(
    @Query('shop') shop: string,
    @Param('id') id: string,
    @AuthUser() user: IAuthUser,
  ) {
    const data = await this.shopifyProductService.deleteProduct(
      shop,
      id,
      user.uid,
    )
    return { data }
  }
}
