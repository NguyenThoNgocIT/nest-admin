import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { BatchProductDto, CreateProductDto, UpdateProductDto } from '../dto/product.dto'
import { ProductService } from '../services/product.service'

@ApiTags('WooCommerce Products - Quản lý sản phẩm')
@Controller('integrations/woocommerce/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post(':storeId')
  @ApiOperation({ summary: 'Tạo sản phẩm mới trên WooCommerce' })
  async create(@Param('storeId') storeId: number, @Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(storeId, createProductDto)
  }

  @Get(':storeId/custom-fields/names')
  @ApiOperation({ summary: 'Retrieve product custom field names' })
  async getCustomFieldNames(@Param('storeId') storeId: number) {
    return this.productService.getCustomFieldNames(storeId)
  }

  @Post(':storeId/batch')
  @ApiOperation({ summary: 'Batch create, update, delete products' })
  async batch(
    @Param('storeId') storeId: number,
    @Body() batchData: BatchProductDto,
  ) {
    return this.productService.batchUpdateProducts(storeId, batchData)
  }

  @Get(':storeId')
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm từ WooCommerce' })
  async findAll(@Param('storeId') storeId: number, @Query() query: any) {
    return this.productService.getProducts(storeId, query)
  }

  @Get(':storeId/:id')
  @ApiOperation({ summary: 'Lấy chi tiết sản phẩm từ WooCommerce' })
  async findOne(@Param('storeId') storeId: number, @Param('id') id: number) {
    return this.productService.getProduct(storeId, id)
  }

  @Put(':storeId/:id')
  @ApiOperation({ summary: 'Cập nhật sản phẩm trên WooCommerce' })
  async update(
    @Param('storeId') storeId: number,
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateProduct(storeId, id, updateProductDto)
  }

  @Delete(':storeId/:id')
  @ApiOperation({ summary: 'Xóa sản phẩm trên WooCommerce' })
  async delete(
    @Param('storeId') storeId: number,
    @Param('id') id: number,
    @Query('force') force: boolean,
  ) {
    return this.productService.deleteProduct(storeId, id, force)
  }

  @Post(':storeId/:id/duplicate')
  @ApiOperation({ summary: 'Duplicate a product' })
  async duplicate(
    @Param('storeId') storeId: number,
    @Param('id') id: number,
  ) {
    return this.productService.duplicateProduct(storeId, id)
  }
}
