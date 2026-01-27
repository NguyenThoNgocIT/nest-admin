import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { AuthUser } from '~/modules/auth/decorators/auth-user.decorator'
import { JwtAuthGuard } from '~/modules/auth/guards/jwt-auth.guard'
import { ShopifyInventoryService } from '../services/shopify-inventory.service'

@ApiTags('Integration - Shopify Inventory')
@Controller('integrations/shopify/inventory')
export class ShopifyInventoryController {
  constructor(private readonly inventoryService: ShopifyInventoryService) {}

  @UseGuards(JwtAuthGuard)
  @Get('locations')
  @ApiOperation({ summary: 'Lấy danh sách Locations' })
  async listLocations(@Query('shop') shop: string, @AuthUser() user: IAuthUser) {
    const data = await this.inventoryService.listLocations(shop, user.uid)
    return { data }
  }

  @UseGuards(JwtAuthGuard)
  @Get('items/:id')
  @ApiOperation({ summary: 'Lấy chi tiết InventoryItem & Levels' })
  async getInventoryItem(
    @Query('shop') shop: string,
    @Param('id') id: string,
    @AuthUser() user: IAuthUser,
  ) {
    const data = await this.inventoryService.getInventoryItem(shop, id, user.uid)
    return { data }
  }

  @UseGuards(JwtAuthGuard)
  @Get('variants/:id')
  @ApiOperation({ summary: 'Lấy Inventory theo Variant ID' })
  async getVariantInventory(
    @Query('shop') shop: string,
    @Param('id') id: string,
    @AuthUser() user: IAuthUser,
  ) {
    const data = await this.inventoryService.getVariantInventory(shop, id, user.uid)
    return { data }
  }

  @UseGuards(JwtAuthGuard)
  @Post('adjust')
  @ApiOperation({ summary: 'Adjust Inventory (Delta change)' })
  async adjustInventory(
    @Body()
    body: {
      shop: string
      changes: Array<{ inventoryItemId: string, locationId: string, delta: number }>
      reason?: string
    },
    @AuthUser() user: IAuthUser,
  ) {
    const { shop, changes, reason } = body
    const data = await this.inventoryService.adjustInventory(shop, changes, user.uid, reason)
    return { data }
  }

  @UseGuards(JwtAuthGuard)
  @Post('set')
  @ApiOperation({ summary: 'Set OnHand Quantity (Absolute set)' })
  async setOnHand(
    @Body()
    body: {
      shop: string
      inputs: Array<{ inventoryItemId: string, locationId: string, quantity: number }>
      reason?: string
    },
    @AuthUser() user: IAuthUser,
  ) {
    const { shop, inputs, reason } = body
    const data = await this.inventoryService.setOnHandQuantities(shop, inputs, user.uid, reason)
    return { data }
  }

  @UseGuards(JwtAuthGuard)
  @Post('activate')
  @ApiOperation({ summary: 'Activate Item at Location' })
  async activate(
    @Body() body: { shop: string, inventoryItemId: string, locationId: string },
    @AuthUser() user: IAuthUser,
  ) {
    const { shop, inventoryItemId, locationId } = body
    const data = await this.inventoryService.activateInventoryItem(
      shop,
      inventoryItemId,
      locationId,
      user.uid,
    )
    return { data }
  }

  @UseGuards(JwtAuthGuard)
  @Post('deactivate')
  @ApiOperation({ summary: 'Deactivate Item at Location' })
  async deactivate(
    @Body() body: { shop: string, inventoryItemId: string, locationId: string },
    @AuthUser() user: IAuthUser,
  ) {
    const { shop, inventoryItemId, locationId } = body
    await this.inventoryService.deactivateInventoryItem(shop, inventoryItemId, locationId, user.uid)
    return { data: { success: true } }
  }
}
