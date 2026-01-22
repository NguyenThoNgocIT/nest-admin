import { Injectable } from '@nestjs/common'
import { CouponService } from './services/coupon.service'
import { OrderService } from './services/order.service'
import { ProductService } from './services/product.service'

@Injectable()
export class WooCommerceAdapter {
  constructor(
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
    private readonly couponService: CouponService,
  ) {}

  async syncProducts(storeId: number) {
    return this.productService.syncProducts(storeId)
  }

  async syncOrders(storeId: number) {
    return this.orderService.syncOrders(storeId)
  }

  async syncCoupons(storeId: number) {
    return this.couponService.syncCoupons(storeId)
  }
}
