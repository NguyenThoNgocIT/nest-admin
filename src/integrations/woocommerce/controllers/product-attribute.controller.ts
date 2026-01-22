import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { BatchProductAttributeDto, CreateProductAttributeDto, UpdateProductAttributeDto } from '../dto/product-attribute.dto'
import { ProductAttributeService } from '../services/product-attribute.service'

@ApiTags('WooCommerce Product Attributes - Thuộc tính sản phẩm')
@Controller('integrations/woocommerce/products/attributes')
export class ProductAttributeController {
  constructor(private readonly attributeService: ProductAttributeService) {}

  @Post(':storeId')
  @ApiOperation({ summary: 'Create a product attribute' })
  async create(
    @Param('storeId') storeId: number,
    @Body() data: CreateProductAttributeDto,
  ) {
    return this.attributeService.createAttribute(storeId, data)
  }

  @Post(':storeId/batch')
  @ApiOperation({ summary: 'Batch create, update, delete attributes' })
  async batch(
    @Param('storeId') storeId: number,
    @Body() batchData: BatchProductAttributeDto,
  ) {
    return this.attributeService.batchUpdateAttributes(storeId, batchData)
  }

  @Get(':storeId')
  @ApiOperation({ summary: 'List all product attributes' })
  async findAll(@Param('storeId') storeId: number, @Query() query: any) {
    return this.attributeService.getAttributes(storeId, query)
  }

  @Get(':storeId/:id')
  @ApiOperation({ summary: 'Retrieve a specific attribute' })
  async findOne(
    @Param('storeId') storeId: number,
    @Param('id') id: number,
  ) {
    return this.attributeService.getAttribute(storeId, id)
  }

  @Put(':storeId/:id')
  @ApiOperation({ summary: 'Update a product attribute' })
  async update(
    @Param('storeId') storeId: number,
    @Param('id') id: number,
    @Body() data: UpdateProductAttributeDto,
  ) {
    return this.attributeService.updateAttribute(storeId, id, data)
  }

  @Delete(':storeId/:id')
  @ApiOperation({ summary: 'Delete a product attribute' })
  async delete(
    @Param('storeId') storeId: number,
    @Param('id') id: number,
    @Query('force') force: boolean,
  ) {
    return this.attributeService.deleteAttribute(storeId, id, force)
  }
}
