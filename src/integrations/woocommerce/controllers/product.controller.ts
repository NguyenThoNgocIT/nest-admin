import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { CreateProductDto } from '../dto/create-product.dto'
import { ProductService } from '../services/product.service'

@Controller('integrations/woocommerce/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post(':storeId')
  async create(@Param('storeId') storeId: number, @Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(storeId, createProductDto)
  }

  @Get(':storeId')
  async findAll(@Param('storeId') storeId: number, @Query() query: any) {
    return this.productService.getProducts(storeId, query)
  }

  @Get(':storeId/:id')
  async findOne(@Param('storeId') storeId: number, @Param('id') id: number) {
    return this.productService.getProduct(storeId, id)
  }
}
