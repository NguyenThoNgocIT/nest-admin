import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ShopifyController } from './controllers/shopify.controller'
import { ShopifyStoreEntity } from './entities/shopify-store.entity'
import { ShopifyClientService } from './services/shopify-client.service'
import { ShopifyOAuthService } from './services/shopify-oauth.service'

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([ShopifyStoreEntity]),
  ],
  controllers: [
    ShopifyController,
  ],
  providers: [
    ShopifyClientService,
    ShopifyOAuthService,
  ],
  exports: [
    ShopifyClientService,
    ShopifyOAuthService,
  ],
})
export class ShopifyModule { }
