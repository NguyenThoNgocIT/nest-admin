import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CouponController } from './controllers/coupon.controller'
import { CustomerController } from './controllers/customer.controller'
import { OrderController } from './controllers/order.controller'
import { ProductController } from './controllers/product.controller'
import { StoreController } from './controllers/store.controller'
import { WooCommerceCouponEntity } from './entities/woocommerce-coupon.entity'
import { WooCommerceCustomerEntity } from './entities/woocommerce-customer.entity'
import { WooCommerceOrderEntity } from './entities/woocommerce-order.entity'
import { WooCommerceProductEntity } from './entities/woocommerce-product.entity'
import { WooCommerceStoreEntity } from './entities/woocommerce-store.entity'
import { CouponService } from './services/coupon.service'
import { CustomerService } from './services/customer.service'
import { OrderService } from './services/order.service'
import { ProductService } from './services/product.service'
import { StoreCredentialsService } from './services/store-credentials.service'
import { WooCommerceClientService } from './services/woocommerce-client.service'
import { WooCommerceAdapter } from './woocommerce.adapter'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WooCommerceStoreEntity,
      WooCommerceProductEntity,
      WooCommerceOrderEntity,
      WooCommerceCouponEntity,
      WooCommerceCustomerEntity,
    ]),
  ],
  controllers: [ProductController, OrderController, StoreController, CouponController, CustomerController],
  providers: [
    StoreCredentialsService,
    WooCommerceClientService,
    ProductService,
    OrderService,
    CouponService,
    CustomerService,
    WooCommerceAdapter,
  ],
  exports: [WooCommerceAdapter, ProductService, OrderService, StoreCredentialsService, CouponService, CustomerService],
})
export class WooCommerceModule {}
