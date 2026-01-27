import { randomUUID } from 'node:crypto'
import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import axios from 'axios'
import { Repository } from 'typeorm'
import { TIKTOK_SELLER_CONFIG } from '../constants/tiktok-seller.constant'
import { TikTokSellerOAuthSessionEntity } from '../entities/tiktok-seller-oauth-session.entity'
import { TikTokSellerStoreEntity } from '../entities/tiktok-seller-store.entity'

@Injectable()
export class TikTokSellerOAuthService {
  private readonly logger = new Logger(TikTokSellerOAuthService.name)
  private readonly appKey: string
  private readonly appSecret: string
  private readonly redirectUri: string
  private readonly serviceId: string | null

  constructor(
    private config: ConfigService,
    @InjectRepository(TikTokSellerStoreEntity)
    private storeRepo: Repository<TikTokSellerStoreEntity>,
    @InjectRepository(TikTokSellerOAuthSessionEntity)
    private sessionRepo: Repository<TikTokSellerOAuthSessionEntity>,
  ) {
    this.appKey = this.config.get('TIKTOK_SHOP_API_KEY')
    this.appSecret = this.config.get('TIKTOK_SHOP_SECRET')
    this.redirectUri = this.config.get('TIKTOK_OAUTH_REDIRECT_URI')
    this.serviceId = this.config.get('TIKTOK_SHOP_SERVICE_ID') || null
  }

  /**
   * 🚀 BƯỚC 1: Tạo URL Authorization
   *
   * ⚠️ CRITICAL FIX:
   * - ISV App (có service_id) → dùng "service_id" parameter
   * - New V2 App (không có service_id) → dùng "app_key" parameter
   */
  async getAuthorizationUrl(merchantId: number): Promise<string> {
    const state = randomUUID()

    // Lưu state vào database
    const expiresAt = new Date(Date.now() + TIKTOK_SELLER_CONFIG.STATE_TTL * 1000)
    await this.sessionRepo.save({
      state,
      merchantId,
      expiresAt,
    })

    // Build URL với parameter ĐÚNG theo app type
    let params: URLSearchParams

    if (this.serviceId) {
      // ISV App (Legacy) - dùng service_id
      this.logger.debug('Using ISV App model with service_id')
      params = new URLSearchParams({
        service_id: this.serviceId,
        state,
        redirect_uri: this.redirectUri,
      })
    }
    else {
      // New V2 App - dùng app_key
      this.logger.debug('Using V2 App model with app_key')
      params = new URLSearchParams({
        app_key: this.appKey,
        state,
        redirect_uri: this.redirectUri,
      })
    }

    const authUrl = `${TIKTOK_SELLER_CONFIG.AUTH_URL}?${params.toString()}`

    this.logger.debug(`Generated TikTok auth URL: ${authUrl}`)

    return authUrl
  }

  /**
   * 🔄 BƯỚC 2: Xử lý Callback
   *
   * TikTok trả về: ?code=...&state=...
   */
  async handleCallback(authCode: string, state: string): Promise<TikTokSellerStoreEntity> {
    // 1. Validate State
    const session = await this.sessionRepo.findOne({ where: { state } })
    if (!session) {
      throw new BadRequestException('State không hợp lệ hoặc không tồn tại (Invalid state).')
    }
    if (new Date() > session.expiresAt) {
      throw new BadRequestException('Phiên kết nối đã hết hạn (Session expired). Vui lòng thử lại.')
    }

    // 2. Xóa state đã dùng
    await this.sessionRepo.delete({ state })

    // 3. Đổi Code lấy Token
    const tokenData = await this.exchangeCodeForTokens(authCode)

    // 4. Lưu/Update Shop
    let store = await this.storeRepo.findOne({
      where: { shopId: tokenData.shop_id },
    })

    if (store) {
      this.logger.log(`Updating existing TikTok store: ${tokenData.shop_name} (${tokenData.shop_id})`)

      store.merchantId = session.merchantId
      store.openId = tokenData.open_id
      store.shopName = tokenData.shop_name
      store.sellerRegion = tokenData.seller_base_region
      store.accessToken = tokenData.access_token
      store.refreshToken = tokenData.refresh_token
      store.tokenExpiresAt = new Date(Date.now() + (tokenData.access_token_expire_in * 1000))
      store.grantedScopes = tokenData.granted_scopes || []
      store.status = 'active'
    }
    else {
      this.logger.log(`Creating new TikTok store: ${tokenData.shop_name} (${tokenData.shop_id})`)

      store = this.storeRepo.create({
        merchantId: session.merchantId,
        shopId: tokenData.shop_id,
        openId: tokenData.open_id,
        shopName: tokenData.shop_name,
        sellerRegion: tokenData.seller_base_region,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenExpiresAt: new Date(Date.now() + (tokenData.access_token_expire_in * 1000)),
        grantedScopes: tokenData.granted_scopes || [],
        status: 'active',
      })
    }

    return this.storeRepo.save(store)
  }

  /**
   * 🔑 Đổi Auth Code → Access Token
   */
  private async exchangeCodeForTokens(authCode: string) {
    try {
      const response = await axios.post(
        TIKTOK_SELLER_CONFIG.TOKEN_URL,
        {
          app_key: this.appKey,
          app_secret: this.appSecret,
          auth_code: authCode,
          grant_type: TIKTOK_SELLER_CONFIG.GRANT_TYPE.AUTHORIZED_CODE,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      )

      if (response.data.code !== 0) {
        throw new Error(response.data.message || 'Lỗi không xác định từ TikTok API')
      }

      const data = response.data.data

      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        access_token_expire_in: data.access_token_expire_in,
        shop_id: data.shop_id,
        shop_name: data.shop_name,
        open_id: data.open_id,
        seller_base_region: data.seller_base_region,
        granted_scopes: data.granted_scopes,
      }
    }
    catch (error) {
      this.logger.error(`Token Exchange Error: ${error.message}`, error.response?.data)
      throw new UnauthorizedException(`Không thể lấy token: ${error.message}`)
    }
  }

  /**
   * 🔄 Refresh Access Token
   */
  async refreshAccessToken(store: TikTokSellerStoreEntity): Promise<TikTokSellerStoreEntity> {
    try {
      const response = await axios.post(
        TIKTOK_SELLER_CONFIG.TOKEN_REFRESH_URL,
        {
          app_key: this.appKey,
          app_secret: this.appSecret,
          refresh_token: store.refreshToken,
          grant_type: TIKTOK_SELLER_CONFIG.GRANT_TYPE.REFRESH_TOKEN,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      )

      if (response.data.code !== 0) {
        throw new Error(response.data.message)
      }

      const data = response.data.data

      store.accessToken = data.access_token
      store.refreshToken = data.refresh_token
      store.tokenExpiresAt = new Date(Date.now() + (data.access_token_expire_in * 1000))
      store.status = 'active'

      return this.storeRepo.save(store)
    }
    catch (error) {
      this.logger.error(`Refresh Token Failed for shop ${store.shopId}: ${error.message}`)
      store.status = 'revoked'
      await this.storeRepo.save(store)
      throw new UnauthorizedException('Refresh token đã hết hạn hoặc bị thu hồi.')
    }
  }
}
