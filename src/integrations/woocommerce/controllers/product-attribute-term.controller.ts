import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  BatchProductAttributeTermDto,
  CreateProductAttributeTermDto,
  UpdateProductAttributeTermDto,
} from '../dto/product-attribute-term.dto'
import { ProductAttributeTermService } from '../services/product-attribute-term.service'

@ApiTags('WooCommerce Product Attribute Terms')
@Controller('integrations/woocommerce/products/attributes/:storeId/:attributeId/terms')
export class ProductAttributeTermController {
  constructor(private readonly productAttributeTermService: ProductAttributeTermService) {}

  @Post()
  @ApiOperation({ summary: 'Create a product attribute term' })
  create(
    @Param('storeId') storeId: number,
    @Param('attributeId') attributeId: number,
    @Body() data: CreateProductAttributeTermDto,
  ) {
    return this.productAttributeTermService.create(storeId, attributeId, data)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a product attribute term' })
  retrieve(
    @Param('storeId') storeId: number,
    @Param('attributeId') attributeId: number,
    @Param('id') id: number,
  ) {
    return this.productAttributeTermService.retrieve(storeId, attributeId, id)
  }

  @Get()
  @ApiOperation({ summary: 'List all product attribute terms' })
  list(
    @Param('storeId') storeId: number,
    @Param('attributeId') attributeId: number,
    @Query() params: any,
  ) {
    return this.productAttributeTermService.list(storeId, attributeId, params)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product attribute term' })
  update(
    @Param('storeId') storeId: number,
    @Param('attributeId') attributeId: number,
    @Param('id') id: number,
    @Body() data: UpdateProductAttributeTermDto,
  ) {
    return this.productAttributeTermService.update(storeId, attributeId, id, data)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product attribute term' })
  delete(
    @Param('storeId') storeId: number,
    @Param('attributeId') attributeId: number,
    @Param('id') id: number,
    @Query('force') force: boolean,
  ) {
    return this.productAttributeTermService.delete(storeId, attributeId, id, force)
  }

  @Post('batch')
  @ApiOperation({ summary: 'Batch create, update, delete product attribute terms' })
  batch(
    @Param('storeId') storeId: number,
    @Param('attributeId') attributeId: number,
    @Body() data: BatchProductAttributeTermDto,
  ) {
    return this.productAttributeTermService.batch(storeId, attributeId, data)
  }
}
