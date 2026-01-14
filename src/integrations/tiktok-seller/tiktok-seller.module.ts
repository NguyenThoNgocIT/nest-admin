import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthModule } from '~/modules/auth/auth.module' // Import AuthModule để dùng Guard
import { TikTokShopWebhookController } from './controllers/tiktok-seller-webhook.controller'
import { TikTokSellerController } from './controllers/tiktok-seller.controller'
import { TikTokSellerOAuthSessionEntity } from './entities/tiktok-seller-oauth-session.entity'
import { TikTokSellerStoreEntity } from './entities/tiktok-seller-store.entity'
import { TikTokSellerClientService } from './services/tiktok-seller-client.service'
import { TikTokSellerOAuthService } from './services/tiktok-seller-oauth.service'
import { TikTokSellerSignatureService } from './services/tiktok-seller-signature.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TikTokSellerStoreEntity,
      TikTokSellerOAuthSessionEntity,
    ]),
    HttpModule,
    AuthModule,
  ],
  controllers: [
    TikTokSellerController,
    TikTokShopWebhookController,
  ],
  providers: [
    TikTokSellerOAuthService,
    TikTokSellerSignatureService,
    TikTokSellerClientService,
  ],
  exports: [
    TikTokSellerClientService,
    TypeOrmModule,
  ],
})
export class TikTokSellerModule {}
