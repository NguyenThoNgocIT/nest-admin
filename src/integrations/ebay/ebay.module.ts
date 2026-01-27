// src/integrations/ebay/ebay.module.ts

import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthModule } from '~/modules/auth/auth.module'
import { EbayController } from './controllers/ebay.controller'
import { EbayStoreEntity } from './entities/ebay-store.entity'
import { EbayClientService } from './services/ebay-client.service'
import { EbayOAuthService } from './services/ebay-oauth.service'
import { EbayOrderService } from './services/ebay-order.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([EbayStoreEntity]),
    HttpModule,
    AuthModule,
  ],
  controllers: [EbayController],
  providers: [
    EbayOAuthService,
    EbayClientService,
    EbayOrderService,
  ],
  exports: [
    EbayClientService,
    EbayOrderService,
  ],
})
export class EbayModule {}
