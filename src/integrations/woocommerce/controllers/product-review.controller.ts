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
  BatchProductReviewDto,
  CreateProductReviewDto,
  UpdateProductReviewDto,
} from '../dto/product-review.dto'
import { ProductReviewService } from '../services/product-review.service'

@ApiTags('WooCommerce Product Reviews - Đánh giá sản phẩm')
@Controller('integrations/woocommerce/products/reviews')
export class ProductReviewController {
  constructor(private readonly productReviewService: ProductReviewService) {}

  @Post(':storeId')
  @ApiOperation({ summary: 'Create a product review' })
  create(
    @Param('storeId') storeId: number,
    @Body() data: CreateProductReviewDto,
  ) {
    return this.productReviewService.create(storeId, data)
  }

  @Get(':storeId/:id')
  @ApiOperation({ summary: 'Retrieve a product review' })
  retrieve(
    @Param('storeId') storeId: number,
    @Param('id') id: number,
  ) {
    return this.productReviewService.retrieve(storeId, id)
  }

  @Get(':storeId')
  @ApiOperation({ summary: 'List all product reviews' })
  list(
    @Param('storeId') storeId: number,
    @Query() params: any,
  ) {
    return this.productReviewService.list(storeId, params)
  }

  @Put(':storeId/:id')
  @ApiOperation({ summary: 'Update a product review' })
  update(
    @Param('storeId') storeId: number,
    @Param('id') id: number,
    @Body() data: UpdateProductReviewDto,
  ) {
    return this.productReviewService.update(storeId, id, data)
  }

  @Delete(':storeId/:id')
  @ApiOperation({ summary: 'Delete a product review' })
  delete(
    @Param('storeId') storeId: number,
    @Param('id') id: number,
    @Query('force') force: boolean,
  ) {
    return this.productReviewService.delete(storeId, id, force)
  }

  @Post(':storeId/batch')
  @ApiOperation({ summary: 'Batch create, update, delete product reviews' })
  batch(
    @Param('storeId') storeId: number,
    @Body() data: BatchProductReviewDto,
  ) {
    return this.productReviewService.batch(storeId, data)
  }
}
