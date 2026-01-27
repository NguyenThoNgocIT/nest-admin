import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { ReportService } from '../services/report.service'

@ApiTags('WooCommerce Reports')
@Controller('integrations/woocommerce/reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get(':storeId')
  @ApiOperation({ summary: 'List all reports (Liệt kê tất cả các loại báo cáo)' })
  /**
   * Liệt kê tất cả các loại báo cáo có sẵn.
   * Endpoint này trả về danh sách các endpoint báo cáo con (slug, description).
   */
  async listAll(@Param('storeId') storeId: number) {
    return await this.reportService.listAll(storeId)
  }

  @Get(':storeId/sales')
  @ApiOperation({ summary: 'Retrieve sales report (Lấy báo cáo doanh thu)' })
  @ApiQuery({ name: 'period', required: false, description: 'week, month, last_month, year' })
  @ApiQuery({ name: 'date_min', required: false, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'date_max', required: false, description: 'YYYY-MM-DD' })
  /**
   * Lấy báo cáo doanh thu bán hàng.
   * Có thể lọc theo khoảng thời gian (period) hoặc ngày cụ thể (date_min, date_max).
   * Trả về tổng doanh thu, số đơn hàng, thuế, phí ship, v.v.
   */
  async getSalesReport(@Param('storeId') storeId: number, @Query() query: any) {
    return await this.reportService.getSalesReport(storeId, query)
  }

  @Get(':storeId/top-sellers')
  @ApiOperation({ summary: 'Retrieve top sellers report (Lấy báo cáo sản phẩm bán chạy)' })
  @ApiQuery({ name: 'period', required: false, description: 'week, month, last_month, year' })
  @ApiQuery({ name: 'date_min', required: false, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'date_max', required: false, description: 'YYYY-MM-DD' })
  /**
   * Lấy báo cáo các sản phẩm bán chạy nhất.
   * Trả về danh sách sản phẩm cùng số lượng đã bán (quantity).
   */
  async getTopSellers(@Param('storeId') storeId: number, @Query() query: any) {
    return await this.reportService.getTopSellers(storeId, query)
  }

  @Get(':storeId/coupons/totals')
  @ApiOperation({ summary: 'Retrieve coupons totals (Lấy tổng hợp về mã giảm giá)' })
  /**
   * Lấy số liệu tổng hợp về các loại mã giảm giá (coupons).
   * Ví dụ: Bao nhiêu coupon giảm theo %, bao nhiêu coupon giảm số tiền cố định.
   */
  async getCouponsTotals(@Param('storeId') storeId: number) {
    return await this.reportService.getCouponsTotals(storeId)
  }

  @Get(':storeId/customers/totals')
  @ApiOperation({ summary: 'Retrieve customers totals (Lấy tổng hợp về khách hàng)' })
  /**
   * Lấy số liệu tổng hợp về khách hàng.
   * Ví dụ: Số lượng khách hàng đã thanh toán (paying), khách mới, v.v.
   */
  async getCustomersTotals(@Param('storeId') storeId: number) {
    return await this.reportService.getCustomersTotals(storeId)
  }

  @Get(':storeId/orders/totals')
  @ApiOperation({ summary: 'Retrieve orders totals (Lấy tổng hợp về đơn hàng)' })
  /**
   * Lấy số liệu tổng hợp về đơn hàng theo trạng thái.
   * Ví dụ: Số đơn pending, processing, completed, cancelled, v.v.
   */
  async getOrdersTotals(@Param('storeId') storeId: number) {
    return await this.reportService.getOrdersTotals(storeId)
  }

  @Get(':storeId/products/totals')
  @ApiOperation({ summary: 'Retrieve products totals (Lấy tổng hợp về sản phẩm)' })
  /**
   * Lấy số liệu tổng hợp về sản phẩm theo loại.
   * Ví dụ: Số lượng sản phẩm đơn giản (simple), biến thể (variable), v.v.
   */
  async getProductsTotals(@Param('storeId') storeId: number) {
    return await this.reportService.getProductsTotals(storeId)
  }

  @Get(':storeId/reviews/totals')
  @ApiOperation({ summary: 'Retrieve reviews totals (Lấy tổng hợp về đánh giá)' })
  /**
   * Lấy số liệu tổng hợp về đánh giá sản phẩm.
   * Ví dụ: Số lượng đánh giá 5 sao, 4 sao, v.v.
   */
  async getReviewsTotals(@Param('storeId') storeId: number) {
    return await this.reportService.getReviewsTotals(storeId)
  }
}
