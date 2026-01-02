import { Injectable } from '@nestjs/common'
import { OrderService } from './services/order.service'
import { ProductService } from './services/product.service'

@Injectable()
export class WooCommerceAdapter {
  constructor(
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
  ) {}

  async syncProducts(storeId: number) {
    return this.productService.syncProducts(storeId)
  }

  async syncOrders(storeId: number) {
    return this.orderService.syncOrders(storeId)
  }
}
