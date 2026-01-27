import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { AuthUser } from '~/modules/auth/decorators/auth-user.decorator'
import { JwtAuthGuard } from '~/modules/auth/guards/jwt-auth.guard'

import { ShopifyCustomerService } from '../services/shopify-customer.service'

@ApiTags('Integration - Shopify Customers')
@Controller('integrations/shopify/customers')
export class ShopifyCustomerController {
  constructor(private readonly customerService: ShopifyCustomerService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'List Customers' })
  async listCustomers(
    @Query('shop') shop: string,
    @Query('limit') limit = 10,
    @Query('q') q: string | undefined,
    @AuthUser() user: IAuthUser,
  ) {
    const data = await this.customerService.listCustomers(shop, Number(limit), q, user.uid)
    return { data }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get Customer Detail' })
  async getCustomer(
    @Query('shop') shop: string,
    @Param('id') id: string,
    @AuthUser() user: IAuthUser,
  ) {
    const data = await this.customerService.getCustomer(shop, id, user.uid)
    return { data }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create Customer' })
  async createCustomer(
    @Body() body: { shop: string, firstName: string, lastName: string, email: string, phone?: string, tags?: string[] },
    @AuthUser() user: IAuthUser,
  ) {
    const { shop, ...input } = body
    const data = await this.customerService.createCustomer(shop, input, user.uid)
    return { data }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update Customer' })
  async updateCustomer(
    @Param('id') id: string,
    @Body() body: { shop: string, firstName?: string, lastName?: string, email?: string, tags?: string[] },
    @AuthUser() user: IAuthUser,
  ) {
    const { shop, ...input } = body
    const data = await this.customerService.updateCustomer(shop, id, input, user.uid)
    return { data }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Customer' })
  async deleteCustomer(
    @Param('id') id: string,
    @Query('shop') shop: string,
    @AuthUser() user: IAuthUser,
  ) {
    const data = await this.customerService.deleteCustomer(shop, id, user.uid)
    return { data }
  }
}
