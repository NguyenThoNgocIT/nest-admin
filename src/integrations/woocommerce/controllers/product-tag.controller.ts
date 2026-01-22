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
  BatchProductTagDto,
  CreateProductTagDto,
  UpdateProductTagDto,
} from '../dto/product-tag.dto'
import { ProductTagService } from '../services/product-tag.service'

@ApiTags('WooCommerce Product Tags - Thẻ sản phẩm')
@Controller('integrations/woocommerce/products/tags')
export class ProductTagController {
  constructor(private readonly productTagService: ProductTagService) {}

  @Post(':storeId')
  @ApiOperation({ summary: 'Create a product tag' })
  create(
    @Param('storeId') storeId: number,
    @Body() data: CreateProductTagDto,
  ) {
    return this.productTagService.create(storeId, data)
  }

  @Get(':storeId/:id')
  @ApiOperation({ summary: 'Retrieve a product tag' })
  retrieve(
    @Param('storeId') storeId: number,
    @Param('id') id: number,
  ) {
    return this.productTagService.retrieve(storeId, id)
  }

  @Get(':storeId')
  @ApiOperation({ summary: 'List all product tags' })
  list(
    @Param('storeId') storeId: number,
    @Query() params: any,
  ) {
    return this.productTagService.list(storeId, params)
  }

  @Put(':storeId/:id')
  @ApiOperation({ summary: 'Update a product tag' })
  update(
    @Param('storeId') storeId: number,
    @Param('id') id: number,
    @Body() data: UpdateProductTagDto,
  ) {
    return this.productTagService.update(storeId, id, data)
  }

  @Delete(':storeId/:id')
  @ApiOperation({ summary: 'Delete a product tag' })
  delete(
    @Param('storeId') storeId: number,
    @Param('id') id: number,
    @Query('force') force: boolean,
  ) {
    return this.productTagService.delete(storeId, id, force)
  }

  @Post(':storeId/batch')
  @ApiOperation({ summary: 'Batch create, update, delete product tags' })
  batch(
    @Param('storeId') storeId: number,
    @Body() data: BatchProductTagDto,
  ) {
    return this.productTagService.batch(storeId, data)
  }
}
