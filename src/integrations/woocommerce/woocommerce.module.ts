import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrderController } from './controllers/order.controller'
import { ProductController } from './controllers/product.controller'
import { StoreController } from './controllers/store.controller'
import { WooCommerceOrderEntity } from './entities/woocommerce-order.entity'
import { WooCommerceProductEntity } from './entities/woocommerce-product.entity'
import { WooCommerceStoreEntity } from './entities/woocommerce-store.entity'
import { OrderService } from './services/order.service'
import { ProductService } from './services/product.service'
import { StoreCredentialsService } from './services/store-credentials.service'
import { WooCommerceClientService } from './services/woocommerce-client.service'
import { WooCommerceAdapter } from './woocommerce.adapter'

@Module({
  imports: [TypeOrmModule.forFeature([WooCommerceStoreEntity, WooCommerceProductEntity, WooCommerceOrderEntity])],
  controllers: [ProductController, OrderController, StoreController],
  providers: [
    StoreCredentialsService,
    WooCommerceClientService,
    ProductService,
    OrderService,
    WooCommerceAdapter,
  ],
  exports: [WooCommerceAdapter, ProductService, OrderService],
})
export class WooCommerceModule {}
