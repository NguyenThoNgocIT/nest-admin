import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateStoreDto, UpdateStoreDto } from '../dto/create-store.dto'
import { StoreCredentialsService } from '../services/store-credentials.service'

@ApiTags('WooCommerce Stores - Quản lý cửa hàng')
@Controller('integrations/woocommerce/stores')
export class StoreController {
  constructor(private readonly storeService: StoreCredentialsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo cửa hàng mới' })
  async create(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.create(createStoreDto)
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách cửa hàng đang hoạt động' })
  async findAll() {
    return this.storeService.getAllActiveStores()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết cửa hàng' })
  async findOne(@Param('id') id: number) {
    return this.storeService.getCredentials(id)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin cửa hàng' })
  async update(@Param('id') id: number, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.update(id, updateStoreDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa cửa hàng' })
  async remove(@Param('id') id: number) {
    return this.storeService.delete(id)
  }
}
