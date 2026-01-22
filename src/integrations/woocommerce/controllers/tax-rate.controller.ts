import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { BatchTaxRateDto, CreateTaxRateDto, UpdateTaxRateDto } from '../dto/tax-rate.dto'
import { TaxRateService } from '../services/tax-rate.service'

@ApiTags('WooCommerce Tax Rates - Quản lý thuế')
@Controller('integrations/woocommerce/taxes')
export class TaxRateController {
  constructor(private readonly taxRateService: TaxRateService) {}

  @Post(':storeId')
  @ApiOperation({ summary: 'Create a tax rate (Tạo mức thuế mới)' })
  /**
   * Tạo mức thuế mới trên WooCommerce.
   */
  async create(@Param('storeId') storeId: number, @Body() data: CreateTaxRateDto) {
    return this.taxRateService.create(storeId, data)
  }

  @Post(':storeId/batch')
  @ApiOperation({ summary: 'Batch update tax rates (Cập nhật hàng loạt mức thuế)' })
  /**
   * Cập nhật hàng loạt (tạo, sửa, xóa) mức thuế.
   */
  async batch(@Param('storeId') storeId: number, @Body() data: BatchTaxRateDto) {
    return this.taxRateService.batch(storeId, data)
  }

  @Get(':storeId')
  @ApiOperation({ summary: 'List all tax rates (Liệt kê tất cả mức thuế)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'per_page', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'orderby', required: false, enum: ['id', 'order', 'priority'] })
  @ApiQuery({ name: 'class', required: false })
  /**
   * Liệt kê danh sách các mức thuế.
   */
  async listAll(@Param('storeId') storeId: number, @Query() query: any) {
    return this.taxRateService.listAll(storeId, query)
  }

  @Get(':storeId/:id')
  @ApiOperation({ summary: 'Retrieve a tax rate (Lấy chi tiết mức thuế)' })
  /**
   * Lấy chi tiết thông tin của một mức thuế theo ID.
   */
  async retrieve(@Param('storeId') storeId: number, @Param('id') id: number) {
    return this.taxRateService.retrieve(storeId, id)
  }

  @Put(':storeId/:id')
  @ApiOperation({ summary: 'Update a tax rate (Cập nhật mức thuế)' })
  /**
   * Cập nhật thông tin mức thuế.
   */
  async update(
    @Param('storeId') storeId: number,
    @Param('id') id: number,
    @Body() data: UpdateTaxRateDto,
  ) {
    return this.taxRateService.update(storeId, id, data)
  }

  @Delete(':storeId/:id')
  @ApiOperation({ summary: 'Delete a tax rate (Xóa mức thuế)' })
  /**
   * Xóa một mức thuế.
   */
  async delete(@Param('storeId') storeId: number, @Param('id') id: number) {
    return this.taxRateService.delete(storeId, id)
  }
}
