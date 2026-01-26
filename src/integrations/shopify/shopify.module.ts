import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '~/modules/auth/auth.module'
import { ShopifyAuthController } from './controllers/shopify-auth.controller'
import { ShopifyOrderController } from './controllers/shopify-order.controller'
import { ShopifyProductController } from './controllers/shopify-product.controller'
import { ShopifyShopController } from './controllers/shopify-shop.controller'
import { ShopifyWebhookController } from './controllers/shopify-webhook.controller'
import { ShopifyStoreEntity } from './entities/shopify-store.entity'
import { ShopifyClientService } from './services/shopify-client.service'
import { ShopifyInventoryService } from './services/shopify-inventory.service'
import { ShopifyOAuthService } from './services/shopify-oauth.service'
import { ShopifyOrderService } from './services/shopify-order.service'
import { ShopifyProductService } from './services/shopify-product.service'
import { ShopifyShopService } from './services/shopify-shop.service'
import { ShopifyWebhookService } from './services/shopify-webhook.service'

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
    ShopifyWebhookController,
  ],
  providers: [
    ShopifyClientService,
    ShopifyOAuthService,
    ShopifyProductService,
    ShopifyOrderService,
    ShopifyShopService,
    ShopifyInventoryService,
    ShopifyWebhookService,
  ],
  exports: [
    ShopifyClientService,
    ShopifyOAuthService,
    ShopifyProductService,
    ShopifyOrderService,
    ShopifyShopService,
    ShopifyInventoryService,
    ShopifyWebhookService,
  ],
})
export class ShopifyModule { }
