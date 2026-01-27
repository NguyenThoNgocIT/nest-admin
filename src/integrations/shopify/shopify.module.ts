import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '~/modules/auth/auth.module'
import { ShopifyAuthController } from './controllers/shopify-auth.controller'
import { ShopifyCustomerController } from './controllers/shopify-customer.controller'
import { ShopifyInventoryController } from './controllers/shopify-inventory.controller'
import { ShopifyMetafieldController } from './controllers/shopify-metafield.controller'
import { ShopifyOrderController } from './controllers/shopify-order.controller'
import { ShopifyProductController } from './controllers/shopify-product.controller'
import { ShopifyShopController } from './controllers/shopify-shop.controller'
import { ShopifyWebhookController } from './controllers/shopify-webhook.controller'
import { ShopifyStoreEntity } from './entities/shopify-store.entity'
import { ShopifyClientService } from './services/shopify-client.service'
import { ShopifyCustomerService } from './services/shopify-customer.service'
import { ShopifyInventoryService } from './services/shopify-inventory.service'
import { ShopifyMetafieldService } from './services/shopify-metafield.service'
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
    ShopifyInventoryController,
    ShopifyCustomerController,
    ShopifyMetafieldController,
  ],
  providers: [
    ShopifyClientService,
    ShopifyOAuthService,
    ShopifyProductService,
    ShopifyOrderService,
    ShopifyShopService,
    ShopifyInventoryService,
    ShopifyWebhookService,
    ShopifyCustomerService,
    ShopifyMetafieldService,
  ],
  exports: [
    ShopifyClientService,
    ShopifyOAuthService,
    ShopifyProductService,
    ShopifyOrderService,
    ShopifyShopService,
    ShopifyInventoryService,
    ShopifyWebhookService,
    ShopifyCustomerService,
    ShopifyMetafieldService,
  ],
})
export class ShopifyModule { }
