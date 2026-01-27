import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateCouponDto, UpdateCouponDto } from '../dto/create-coupon.dto'
import { CouponService } from '../services/coupon.service'

@ApiTags('WooCommerce Coupons - Quản lý mã giảm giá')
@Controller('integrations/woocommerce/coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post(':storeId')
  @ApiOperation({ summary: 'Tạo mã giảm giá mới trên WooCommerce' })
  async create(@Param('storeId') storeId: number, @Body() createCouponDto: CreateCouponDto) {
    return this.couponService.createCoupon(storeId, createCouponDto)
  }

  @Get(':storeId')
  @ApiOperation({ summary: 'Lấy danh sách mã giảm giá từ WooCommerce' })
  async findAll(@Param('storeId') storeId: number, @Query() query: any) {
    return this.couponService.getCoupons(storeId, query)
  }

  @Get(':storeId/:id')
  @ApiOperation({ summary: 'Lấy chi tiết mã giảm giá từ WooCommerce' })
  async findOne(@Param('storeId') storeId: number, @Param('id') id: number) {
    return this.couponService.getCoupon(storeId, id)
  }

  @Put(':storeId/:id')
  @ApiOperation({ summary: 'Cập nhật mã giảm giá trên WooCommerce' })
  async update(
    @Param('storeId') storeId: number,
    @Param('id') id: number,
    @Body() updateCouponDto: UpdateCouponDto,
  ) {
    return this.couponService.updateCoupon(storeId, id, updateCouponDto)
  }

  @Delete(':storeId/:id')
  @ApiOperation({ summary: 'Xóa mã giảm giá trên WooCommerce' })
  async remove(@Param('storeId') storeId: number, @Param('id') id: number, @Query('force') force: boolean) {
    return this.couponService.deleteCoupon(storeId, id, force)
  }

  @Post(':storeId/sync')
  @ApiOperation({ summary: 'Đồng bộ mã giảm giá từ WooCommerce về database' })
  async sync(@Param('storeId') storeId: number) {
    return this.couponService.syncCoupons(storeId)
  }
}
