// src/integrations/ebay/services/ebay-client.service.ts

import type { AxiosInstance } from 'axios'
import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'

import { EBAY_CONFIG } from '../constants/ebay.constant'
import { EbayStoreEntity } from '../entities/ebay-store.entity'
import { EbayOAuthService } from './ebay-oauth.service'

@Injectable()
export class EbayClientService {
  constructor(
    private readonly oauthService: EbayOAuthService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * 🔧 Create authenticated HTTP client
   */
  async getClient(store: EbayStoreEntity): Promise<AxiosInstance> {
    // Auto-refresh token if expired (or nearly expired, e.g. < 5 minutes left)
    // Date.now() >= store.tokenExpiresAt.getTime() - 5 * 60 * 1000
    if (new Date().getTime() >= store.tokenExpiresAt.getTime() - 300000) {
      store = await this.oauthService.refreshAccessToken(store)
    }

    const env = (this.configService.get('EBAY_ENV') as 'SANDBOX' | 'PRODUCTION') || 'SANDBOX'
    const apiBase = EBAY_CONFIG[env].API_BASE

    const instance = axios.create({
      baseURL: apiBase,
      headers: {
        'Authorization': `Bearer ${store.accessToken}`,
        'Content-Type': 'application/json',
        'X-EBAY-C-MARKETPLACE-ID': store.marketplaceId, // ← BẮT BUỘC
      },
    })

    return instance
  }
}
