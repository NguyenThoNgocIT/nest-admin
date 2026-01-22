import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CouponController } from './controllers/coupon.controller'
import { CustomerController } from './controllers/customer.controller'
import { OrderActionsController } from './controllers/order-actions.controller'
import { OrderRefundController } from './controllers/order-refund.controller'
import { OrderController } from './controllers/order.controller'
import { ProductController } from './controllers/product.controller'
import { StoreController } from './controllers/store.controller'
import { WooCommerceCouponEntity } from './entities/woocommerce-coupon.entity'
import { WooCommerceCustomerEntity } from './entities/woocommerce-customer.entity'
import { WooCommerceOrderNoteEntity } from './entities/woocommerce-order-note.entity'
import { WooCommerceOrderRefundEntity } from './entities/woocommerce-order-refund.entity'
import { WooCommerceOrderEntity } from './entities/woocommerce-order.entity'
import { WooCommerceProductEntity } from './entities/woocommerce-product.entity'
import { WooCommerceStoreEntity } from './entities/woocommerce-store.entity'
import { CouponService } from './services/coupon.service'
import { CustomerService } from './services/customer.service'
import { OrderActionsService } from './services/order-actions.service'
import { OrderRefundService } from './services/order-refund.service'
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
      WooCommerceOrderNoteEntity,
      WooCommerceOrderRefundEntity,
      WooCommerceCouponEntity,
      WooCommerceCustomerEntity,
    ]),
  ],
  controllers: [
    StoreController,
    ProductController,
    OrderController,
    CouponController,
    CustomerController,
    OrderActionsController,
    OrderRefundController,
  ],
  providers: [
    StoreCredentialsService,
    WooCommerceClientService,
    ProductService,
    OrderService,
    OrderActionsService,
    OrderRefundService,
    CouponService,
    CustomerService,
    WooCommerceAdapter,
  ],
  exports: [
    WooCommerceAdapter,
    ProductService,
    OrderService,
    StoreCredentialsService,
    CouponService,
    CustomerService,
    OrderActionsService,
    OrderRefundService,
  ],
})
export class WooCommerceModule {}
