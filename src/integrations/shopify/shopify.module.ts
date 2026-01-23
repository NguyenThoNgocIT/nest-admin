import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '~/modules/auth/auth.module'
import { ShopifyController } from './controllers/shopify.controller'
import { ShopifyStoreEntity } from './entities/shopify-store.entity'
import { ShopifyAdminService } from './services/shopify-admin.service'
import { ShopifyClientService } from './services/shopify-client.service'
import { ShopifyOAuthService } from './services/shopify-oauth.service'

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    TypeOrmModule.forFeature([ShopifyStoreEntity]),
  ],
  controllers: [
    ShopifyController,
  ],
  providers: [
    ShopifyClientService,
    ShopifyOAuthService,
    ShopifyAdminService,
  ],
  exports: [
    ShopifyClientService,
    ShopifyOAuthService,
  ],
})
export class ShopifyModule { }
