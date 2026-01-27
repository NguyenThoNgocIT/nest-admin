import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { AuthUser } from '~/modules/auth/decorators/auth-user.decorator'
import { JwtAuthGuard } from '~/modules/auth/guards/jwt-auth.guard'
import { ShopifyMetafieldService } from '../services/shopify-metafield.service'

@ApiTags('Integration - Shopify Metafields')
@Controller('integrations/shopify/metafields')
export class ShopifyMetafieldController {
  constructor(private readonly metafieldService: ShopifyMetafieldService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':ownerId')
  @ApiOperation({ summary: 'Get Metafields by Owner ID (Product, Order, Customer GID)' })
  async getMetafields(
    @Query('shop') shop: string,
    @Param('ownerId') ownerId: string,
    @AuthUser() user: IAuthUser,
  ) {
    const data = await this.metafieldService.getMetafields(shop, ownerId, user.uid)
    return { data }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Set Metafields (Batch Create/Update)' })
  async setMetafields(
    @Body()
    body: {
      shop: string
      metafields: Array<{
        ownerId: string
        namespace: string
        key: string
        value: string
        type: string
      }>
    },
    @AuthUser() user: IAuthUser,
  ) {
    const { shop, metafields } = body
    const data = await this.metafieldService.setMetafields(shop, metafields, user.uid)
    return { data }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Metafield by ID' })
  async deleteMetafield(
    @Param('id') id: string,
    @Query('shop') shop: string,
    @AuthUser() user: IAuthUser,
  ) {
    const data = await this.metafieldService.deleteMetafield(shop, id, user.uid)
    return { data }
  }
}
