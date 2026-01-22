import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateTaxClassDto } from '../dto/tax-class.dto'
import { TaxClassService } from '../services/tax-class.service'

@ApiTags('WooCommerce Tax Classes - Quản lý loại thuế')
@Controller('integrations/woocommerce/taxes/classes')
export class TaxClassController {
  constructor(private readonly taxClassService: TaxClassService) {}

  @Post(':storeId')
  @ApiOperation({ summary: 'Create a tax class (Tạo loại thuế mới)' })
  /**
   * Tạo một loại thuế mới (Tax Class).
   */
  async create(@Param('storeId') storeId: number, @Body() data: CreateTaxClassDto) {
    return this.taxClassService.create(storeId, data)
  }

  @Get(':storeId')
  @ApiOperation({ summary: 'List all tax classes (Liệt kê tất cả loại thuế)' })
  /**
   * Liệt kê tất cả các loại thuế hiện có.
   */
  async listAll(@Param('storeId') storeId: number) {
    return this.taxClassService.listAll(storeId)
  }

  @Delete(':storeId/:slug')
  @ApiOperation({ summary: 'Delete a tax class (Xóa loại thuế)' })
  /**
   * Xóa một loại thuế dựa trên slug.
   * Lưu ý: Hành động này sẽ xóa tất cả các mức thuế (rates) thuộc loại thuế này.
   */
  async delete(@Param('storeId') storeId: number, @Param('slug') slug: string) {
    return this.taxClassService.delete(storeId, slug)
  }
}
