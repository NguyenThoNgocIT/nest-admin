import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '~/modules/auth/auth.module'
import { ShopifyAuthController } from './controllers/shopify-auth.controller'
import { ShopifyOrderController } from './controllers/shopify-order.controller'
import { ShopifyProductController } from './controllers/shopify-product.controller'
import { ShopifyShopController } from './controllers/shopify-shop.controller'
import { ShopifyStoreEntity } from './entities/shopify-store.entity'
import { ShopifyClientService } from './services/shopify-client.service'
import { ShopifyOAuthService } from './services/shopify-oauth.service'
import { ShopifyOrderService } from './services/shopify-order.service'
import { ShopifyProductService } from './services/shopify-product.service'
import { ShopifyShopService } from './services/shopify-shop.service'

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    TypeOrmModule.forFeature([ShopifyStoreEntity]),
  ],
  controllers: [
    ShopifyAuthController,
    ShopifyShopController,
    ShopifyProductController,
    ShopifyOrderController,
  ],
  providers: [
    ShopifyClientService,
    ShopifyOAuthService,
    ShopifyProductService,
    ShopifyOrderService,
    ShopifyShopService,
  ],
  exports: [
    ShopifyClientService,
    ShopifyOAuthService,
    ShopifyProductService,
    ShopifyOrderService,
    ShopifyShopService,
  ],
})
export class ShopifyModule { }
