import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { BatchProductVariationDto, CreateProductVariationDto, UpdateProductVariationDto } from '../dto/product-variation.dto'
import { ProductVariationService } from '../services/product-variation.service'

@ApiTags('WooCommerce Product Variations - Biến thể sản phẩm')
@Controller('integrations/woocommerce/products/:storeId/:productId/variations')
export class ProductVariationController {
  constructor(private readonly variationService: ProductVariationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a variation for a product' })
  async create(
    @Param('storeId') storeId: number,
    @Param('productId') productId: number,
    @Body() data: CreateProductVariationDto,
  ) {
    return this.variationService.createVariation(storeId, productId, data)
  }

  @Post('batch')
  @ApiOperation({ summary: 'Batch create, update, delete variations' })
  async batch(
    @Param('storeId') storeId: number,
    @Param('productId') productId: number,
    @Body() batchData: BatchProductVariationDto,
  ) {
    return this.variationService.batchUpdateVariations(storeId, productId, batchData)
  }

  @Get()
  @ApiOperation({ summary: 'List all variations of a product' })
  async findAll(@Param('storeId') storeId: number, @Param('productId') productId: number, @Query() query: any) {
    return this.variationService.getVariations(storeId, productId, query)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific variation' })
  async findOne(
    @Param('storeId') storeId: number,
    @Param('productId') productId: number,
    @Param('id') id: number,
  ) {
    return this.variationService.getVariation(storeId, productId, id)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a variation' })
  async update(
    @Param('storeId') storeId: number,
    @Param('productId') productId: number,
    @Param('id') id: number,
    @Body() data: UpdateProductVariationDto,
  ) {
    return this.variationService.updateVariation(storeId, productId, id, data)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a variation' })
  async delete(
    @Param('storeId') storeId: number,
    @Param('productId') productId: number,
    @Param('id') id: number,
    @Query('force') force: boolean,
  ) {
    return this.variationService.deleteVariation(storeId, productId, id, force)
  }
}
