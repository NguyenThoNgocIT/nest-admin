import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { CreateStoreDto, UpdateStoreDto } from '../dto/create-store.dto'
import { StoreCredentialsService } from '../services/store-credentials.service'

@Controller('integrations/woocommerce/stores')
export class StoreController {
  constructor(private readonly storeService: StoreCredentialsService) {}

  @Post()
  async create(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.create(createStoreDto)
  }

  @Get()
  async findAll() {
    return this.storeService.getAllActiveStores()
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.storeService.getCredentials(id)
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.update(id, updateStoreDto)
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.storeService.delete(id)
  }
}
