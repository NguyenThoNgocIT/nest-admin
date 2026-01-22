import { Controller, Get, Param } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { DataService } from '../services/data.service'

@ApiTags('WooCommerce Data - Dữ liệu Chung')
@Controller('integrations/woocommerce/data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get(':storeId')
  @ApiOperation({ summary: 'List all data resources (Liệt kê các tài nguyên dữ liệu)' })
  /**
   * Lấy danh sách các tài nguyên dữ liệu khả dụng (continents, countries, currencies).
   */
  async listDataResources(@Param('storeId') storeId: number) {
    return this.dataService.listDataResources(storeId)
  }

  @Get(':storeId/continents')
  @ApiOperation({ summary: 'List all continents (Liệt kê tất cả châu lục)' })
  /**
   * Lấy danh sách tất cả các châu lục và các quốc gia thuộc châu lục đó.
   */
  async listContinents(@Param('storeId') storeId: number) {
    return this.dataService.listContinents(storeId)
  }

  @Get(':storeId/continents/:location')
  @ApiOperation({ summary: 'Retrieve continent data (Lấy thông tin chi tiết châu lục)' })
  /**
   * Xem thông tin chi tiết của một châu lục cụ thể (ví dụ: 'EU', 'AF').
   */
  async getContinent(@Param('storeId') storeId: number, @Param('location') location: string) {
    return this.dataService.getContinent(storeId, location)
  }

  @Get(':storeId/countries')
  @ApiOperation({ summary: 'List all countries (Liệt kê tất cả quốc gia)' })
  /**
   * Lấy danh sách tất cả các quốc gia và các bang/tỉnh của chúng.
   */
  async listCountries(@Param('storeId') storeId: number) {
    return this.dataService.listCountries(storeId)
  }

  @Get(':storeId/countries/:location')
  @ApiOperation({ summary: 'Retrieve country data (Lấy thông tin chi tiết quốc gia)' })
  /**
   * Xem thông tin chi tiết của một quốc gia cụ thể (ví dụ: 'US', 'VN').
   */
  async getCountry(@Param('storeId') storeId: number, @Param('location') location: string) {
    return this.dataService.getCountry(storeId, location)
  }

  @Get(':storeId/currencies')
  @ApiOperation({ summary: 'List all currencies (Liệt kê tất cả tiền tệ)' })
  /**
   * Lấy danh sách tất cả các loại tiền tệ được hỗ trợ.
   */
  async listCurrencies(@Param('storeId') storeId: number) {
    return this.dataService.listCurrencies(storeId)
  }

  @Get(':storeId/currencies/current')
  @ApiOperation({ summary: 'Retrieve current currency (Lấy thông tin tiền tệ hiện tại của cửa hàng)' })
  /**
   * Lấy thông tin về loại tiền tệ đang được cấu hình cho cửa hàng.
   */
  async getCurrentCurrency(@Param('storeId') storeId: number) {
    return this.dataService.getCurrentCurrency(storeId)
  }

  @Get(':storeId/currencies/:currency')
  @ApiOperation({ summary: 'Retrieve currency data (Lấy thông tin chi tiết tiền tệ)' })
  /**
   * Xem thông tin chi tiết của một loại tiền tệ cụ thể (ví dụ: 'USD', 'EUR').
   */
  async getCurrency(@Param('storeId') storeId: number, @Param('currency') currency: string) {
    return this.dataService.getCurrency(storeId, currency)
  }
}
