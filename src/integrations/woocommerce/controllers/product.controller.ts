import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateProductDto } from '../dto/create-product.dto'
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
}
