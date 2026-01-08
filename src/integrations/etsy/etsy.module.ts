import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '~/modules/auth/auth.module'

import { EtsyController } from './controllers/etsy.controller'
import { EtsyStoreEntity } from './entities/etsy-store.entity'
import { EtsyClientService } from './services/etsy-client.service'
import { EtsyOAuthService } from './services/etsy-oauth.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([EtsyStoreEntity]),
    HttpModule,
    AuthModule,
  ],
  controllers: [EtsyController],
  providers: [
    EtsyClientService,
    EtsyOAuthService,
    // CacheService được export từ Global SharedModule -> RedisModule
    // Nên không cần provide lại ở đây nếu SharedModule đã @Global
  ],
  exports: [EtsyClientService, EtsyOAuthService],
})
export class EtsyModule {}
