import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { BatchSettingOptionDto, UpdateSettingOptionDto } from '../dto/setting-option.dto'
import { SettingService } from '../services/setting.service'

@ApiTags('WooCommerce Settings - Quản lý Cài đặt')
@Controller('integrations/woocommerce/settings')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get(':storeId')
  @ApiOperation({ summary: 'List all settings groups (Liệt kê các nhóm cài đặt)' })
  /**
   * Lấy danh sách tất cả các nhóm cài đặt có sẵn trong WooCommerce (ví dụ: General, Products, Tax, Shipping...).
   */
  async listGroups(@Param('storeId') storeId: number) {
    return this.settingService.listGroups(storeId)
  }

  @Get(':storeId/:groupId')
  @ApiOperation({ summary: 'List all setting options (Liệt kê tùy chọn cài đặt)' })
  /**
   * Lấy danh sách các tùy chọn chi tiết trong một nhóm cài đặt (ví dụ: các tùy chọn trong nhóm General).
   */
  async listOptions(@Param('storeId') storeId: number, @Param('groupId') groupId: string) {
    return this.settingService.listOptions(storeId, groupId)
  }

  @Get(':storeId/:groupId/:optionId')
  @ApiOperation({ summary: 'Retrieve a setting option (Lấy chi tiết tùy chọn)' })
  /**
   * Xem giá trị và thông tin của một tùy chọn cài đặt cụ thể.
   */
  async retrieveOption(
    @Param('storeId') storeId: number,
    @Param('groupId') groupId: string,
    @Param('optionId') optionId: string,
  ) {
    return this.settingService.retrieveOption(storeId, groupId, optionId)
  }

  @Put(':storeId/:groupId/:optionId')
  @ApiOperation({ summary: 'Update a setting option (Cập nhật tùy chọn)' })
  /**
   * Thay đổi giá trị của một tùy chọn cài đặt.
   */
  async updateOption(
    @Param('storeId') storeId: number,
    @Param('groupId') groupId: string,
    @Param('optionId') optionId: string,
    @Body() data: UpdateSettingOptionDto,
  ) {
    return this.settingService.updateOption(storeId, groupId, optionId, data)
  }

  @Post(':storeId/:groupId/batch')
  @ApiOperation({ summary: 'Batch update setting options (Cập nhật hàng loạt tùy chọn)' })
  /**
   * Cập nhật nhiều tùy chọn cài đặt cùng lúc trong một nhóm.
   */
  async batchUpdateOptions(
    @Param('storeId') storeId: number,
    @Param('groupId') groupId: string,
    @Body() data: BatchSettingOptionDto,
  ) {
    return this.settingService.batchUpdateOptions(storeId, groupId, data)
  }
}
