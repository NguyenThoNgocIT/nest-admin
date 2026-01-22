import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ShippingZoneLocationDto } from '../dto/shipping-zone-location.dto'
import { CreateShippingZoneDto, UpdateShippingZoneDto } from '../dto/shipping-zone.dto'
import { ShippingZoneService } from '../services/shipping-zone.service'

@ApiTags('WooCommerce Shipping Zones - Quản lý Vùng giao hàng')
@Controller('integrations/woocommerce/shipping/zones')
export class ShippingZoneController {
  constructor(private readonly shippingZoneService: ShippingZoneService) {}

  @Post(':storeId')
  @ApiOperation({ summary: 'Create a shipping zone (Tạo vùng giao hàng mới)' })
  /**
   * Tạo một vùng giao hàng mới.
   */
  async create(@Param('storeId') storeId: number, @Body() data: CreateShippingZoneDto) {
    return this.shippingZoneService.create(storeId, data)
  }

  @Get(':storeId')
  @ApiOperation({ summary: 'List all shipping zones (Liệt kê tất cả vùng giao hàng)' })
  /**
   * Lấy danh sách tất cả các vùng giao hàng (bao gồm cả vùng mặc định "Rest of the World").
   */
  async listAll(@Param('storeId') storeId: number) {
    return this.shippingZoneService.listAll(storeId)
  }

  @Get(':storeId/:id')
  @ApiOperation({ summary: 'Retrieve a shipping zone (Lấy chi tiết vùng giao hàng)' })
  /**
   * Xem thông tin chi tiết của một vùng giao hàng cụ thể.
   */
  async retrieve(@Param('storeId') storeId: number, @Param('id') id: number) {
    return this.shippingZoneService.retrieve(storeId, id)
  }

  @Put(':storeId/:id')
  @ApiOperation({ summary: 'Update a shipping zone (Cập nhật vùng giao hàng)' })
  /**
   * Cập nhật thông tin vùng giao hàng (tên, thứ tự sắp xếp).
   */
  async update(
    @Param('storeId') storeId: number,
    @Param('id') id: number,
    @Body() data: UpdateShippingZoneDto,
  ) {
    return this.shippingZoneService.update(storeId, id, data)
  }

  @Delete(':storeId/:id')
  @ApiOperation({ summary: 'Delete a shipping zone (Xóa vùng giao hàng)' })
  /**
   * Xóa vĩnh viễn một vùng giao hàng.
   */
  async delete(@Param('storeId') storeId: number, @Param('id') id: number) {
    return this.shippingZoneService.delete(storeId, id)
  }

  @Get(':storeId/:id/locations')
  @ApiOperation({ summary: 'List all locations of a shipping zone (Liệt kê các địa điểm của vùng giao hàng)' })
  /**
   * Lấy danh sách các địa điểm (locations) thuộc về một vùng giao hàng.
   */
  async listLocations(@Param('storeId') storeId: number, @Param('id') id: number) {
    return this.shippingZoneService.listLocations(storeId, id)
  }

  @Put(':storeId/:id/locations')
  @ApiOperation({ summary: 'Update locations of a shipping zone (Cập nhật địa điểm của vùng giao hàng)' })
  /**
   * Cập nhật danh sách địa điểm cho một vùng giao hàng. Lưu ý: Thao tác này sẽ thay thế toàn bộ địa điểm cũ bằng danh sách mới.
   */
  async updateLocations(
    @Param('storeId') storeId: number,
    @Param('id') id: number,
    @Body() data: ShippingZoneLocationDto[],
  ) {
    return this.shippingZoneService.updateLocations(storeId, id, data)
  }
}
