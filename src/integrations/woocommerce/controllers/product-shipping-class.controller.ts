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
  BatchProductShippingClassDto,
  CreateProductShippingClassDto,
  UpdateProductShippingClassDto,
} from '../dto/product-shipping-class.dto'
import { ProductShippingClassService } from '../services/product-shipping-class.service'

@ApiTags('WooCommerce Product Shipping Classes')
@Controller('integrations/woocommerce/products/shipping_classes')
export class ProductShippingClassController {
  constructor(private readonly productShippingClassService: ProductShippingClassService) {}

  @Post(':storeId')
  @ApiOperation({ summary: 'Create a product shipping class' })
  create(
    @Param('storeId') storeId: number,
    @Body() data: CreateProductShippingClassDto,
  ) {
    return this.productShippingClassService.create(storeId, data)
  }

  @Get(':storeId/:id')
  @ApiOperation({ summary: 'Retrieve a product shipping class' })
  retrieve(
    @Param('storeId') storeId: number,
    @Param('id') id: number,
  ) {
    return this.productShippingClassService.retrieve(storeId, id)
  }

  @Get(':storeId')
  @ApiOperation({ summary: 'List all product shipping classes' })
  list(
    @Param('storeId') storeId: number,
    @Query() params: any,
  ) {
    return this.productShippingClassService.list(storeId, params)
  }

  @Put(':storeId/:id')
  @ApiOperation({ summary: 'Update a product shipping class' })
  update(
    @Param('storeId') storeId: number,
    @Param('id') id: number,
    @Body() data: UpdateProductShippingClassDto,
  ) {
    return this.productShippingClassService.update(storeId, id, data)
  }

  @Delete(':storeId/:id')
  @ApiOperation({ summary: 'Delete a product shipping class' })
  delete(
    @Param('storeId') storeId: number,
    @Param('id') id: number,
    @Query('force') force: boolean,
  ) {
    return this.productShippingClassService.delete(storeId, id, force)
  }

  @Post(':storeId/batch')
  @ApiOperation({ summary: 'Batch create, update, delete product shipping classes' })
  batch(
    @Param('storeId') storeId: number,
    @Body() data: BatchProductShippingClassDto,
  ) {
    return this.productShippingClassService.batch(storeId, data)
  }
}
