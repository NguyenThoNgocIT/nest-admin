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
  BatchProductCategoryDto,
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
} from '../dto/product-category.dto'
import { ProductCategoryService } from '../services/product-category.service'

@ApiTags('WooCommerce Product Categories - Danh mục sản phẩm')
@Controller('integrations/woocommerce/products/categories')
export class ProductCategoryController {
  constructor(private readonly productCategoryService: ProductCategoryService) {}

  @Post(':storeId')
  @ApiOperation({ summary: 'Create a product category' })
  create(
    @Param('storeId') storeId: number,
    @Body() data: CreateProductCategoryDto,
  ) {
    return this.productCategoryService.create(storeId, data)
  }

  @Get(':storeId/:id')
  @ApiOperation({ summary: 'Retrieve a product category' })
  retrieve(
    @Param('storeId') storeId: number,
    @Param('id') id: number,
  ) {
    return this.productCategoryService.retrieve(storeId, id)
  }

  @Get(':storeId')
  @ApiOperation({ summary: 'List all product categories' })
  list(
    @Param('storeId') storeId: number,
    @Query() params: any,
  ) {
    return this.productCategoryService.list(storeId, params)
  }

  @Put(':storeId/:id')
  @ApiOperation({ summary: 'Update a product category' })
  update(
    @Param('storeId') storeId: number,
    @Param('id') id: number,
    @Body() data: UpdateProductCategoryDto,
  ) {
    return this.productCategoryService.update(storeId, id, data)
  }

  @Delete(':storeId/:id')
  @ApiOperation({ summary: 'Delete a product category' })
  delete(
    @Param('storeId') storeId: number,
    @Param('id') id: number,
    @Query('force') force: boolean,
  ) {
    return this.productCategoryService.delete(storeId, id, force)
  }

  @Post(':storeId/batch')
  @ApiOperation({ summary: 'Batch create, update, delete product categories' })
  batch(
    @Param('storeId') storeId: number,
    @Body() data: BatchProductCategoryDto,
  ) {
    return this.productCategoryService.batch(storeId, data)
  }
}
