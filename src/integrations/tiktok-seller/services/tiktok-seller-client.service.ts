import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios, { AxiosRequestConfig } from 'axios'
import { TIKTOK_SELLER_CONFIG } from '../constants/tiktok-seller.constant'
import { TikTokSellerStoreEntity } from '../entities/tiktok-seller-store.entity'
import { TikTokSellerOAuthService } from './tiktok-seller-oauth.service'
import { TikTokSellerSignatureService } from './tiktok-seller-signature.service'

@Injectable()
export class TikTokSellerClientService {
  private readonly logger = new Logger(TikTokSellerClientService.name)
  private readonly appKey: string
  private readonly appSecret: string

  constructor(
    private config: ConfigService,
    private oauthService: TikTokSellerOAuthService,
    private signatureService: TikTokSellerSignatureService,
  ) {
    this.appKey = config.get('TIKTOK_SHOP_API_KEY')
    this.appSecret = config.get('TIKTOK_SHOP_SECRET')
  }

  /**
   * 🔧 Gửi Request đến TikTok Shop API (Đã ký Signature)
   *
   * Tự động xử lý:
   * 1. Kiểm tra hết hạn Token -> Refresh Token
   * 2. Tạo Signature HMAC-SHA256
   * 3. Gắn Header và Params cần thiết
   */
  async request(
    store: TikTokSellerStoreEntity,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    params: Record<string, any> = {},
    body?: any,
  ) {
    // 1. Kiểm tra Token Expiry
    // Nếu token còn sống dưới 24h, thực hiện refresh luôn cho chắc
    const oneDayInMs = 24 * 60 * 60 * 1000
    const now = new Date()
    if (store.tokenExpiresAt.getTime() - now.getTime() < oneDayInMs) {
      this.logger.log(`Access Token sắp hết hạn, đang refresh cho shop: ${store.shopId}`)
      try {
        store = await this.oauthService.refreshAccessToken(store)
      }
      catch (e) {
        throw new Error(`Auto-refresh failed: ${e.message}`)
      }
    }

    // 2. Chuẩn bị Params để ký
    const commonParams = {
      app_key: this.appKey,
      timestamp: Math.floor(Date.now() / 1000),
      shop_id: store.shopId,
      version: TIKTOK_SELLER_CONFIG.API_VERSION,
      // Các params nghiệp vụ
      ...params,
    }

    // 3. Generate Signature
    // Lưu ý: path truyền vào signature service không nên chứa domain
    const { signature, timestamp } = this.signatureService.generateSignature(
      this.appSecret,
      this.appKey,
      store.accessToken,
      path,
      commonParams, // Params đã gộp timestamp & shop_id
      body,
    )

    // 4. Update lại params với timestamp chuẩn (từ signature service) và sign
    const finalParams = {
      ...commonParams,
      timestamp, // Đảm bảo timestamp thống nhất
      sign: signature,
    }

    // 5. Build URL & Config
    const url = `${TIKTOK_SELLER_CONFIG.API_BASE}${path}`

    const config: AxiosRequestConfig = {
      method,
      url,
      params: finalParams,
      data: method !== 'GET' ? body : undefined,
      headers: {
        'Content-Type': 'application/json',
        'x-tts-access-token': store.accessToken, // Header bắt buộc từ 2023
      },
    }

    // 6. Execute Request
    try {
      const response = await axios(config)

      // TikTok API luôn trả về 200 OK ngay cả khi lỗi nghiệp vụ
      // Cần check body code
      if (response.data.code !== 0) {
        throw new Error(`TikTok API Error [${response.data.code}]: ${response.data.message}`)
      }

      return response.data.data
    }
    catch (error) {
      this.logger.error(`TikTok API Request Failed: ${path}`, error.response?.data || error.message)
      throw error
    }
  }

  // Wrappers
  async get(store: TikTokSellerStoreEntity, path: string, params: Record<string, any> = {}) {
    return this.request(store, 'GET', path, params)
  }

  async post(store: TikTokSellerStoreEntity, path: string, body: any, params: Record<string, any> = {}) {
    return this.request(store, 'POST', path, params, body)
  }
}
