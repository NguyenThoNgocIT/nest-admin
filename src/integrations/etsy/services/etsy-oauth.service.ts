import { HttpService } from '@nestjs/axios'
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { lastValueFrom } from 'rxjs'
import { Repository } from 'typeorm'
import { CacheService } from '~/shared/redis/cache.service'

import {
  ETSY_AUTH_URL,
  ETSY_OAUTH_STATE_PREFIX,
  ETSY_OAUTH_STATE_TTL,
  ETSY_SCOPES,
  ETSY_TOKEN_URL,
} from '../constants/etsy.constant'
import { EtsyStoreEntity } from '../entities/etsy-store.entity'
import { generateCodeChallenge, generateRandomString } from '../utils/pkce.util'
import { EtsyClientService } from './etsy-client.service'

@Injectable()
export class EtsyOAuthService {
  private readonly logger = new Logger(EtsyOAuthService.name)

  constructor(
    @InjectRepository(EtsyStoreEntity)
    private readonly storeRepo: Repository<EtsyStoreEntity>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService,
    private readonly etsyClient: EtsyClientService,
  ) {}

  private get apiKey() {
    return this.configService.get<string>('ETSY_API_KEY')
  }

  private get redirectUri() {
    return `${this.configService.get<string>('APP_BASE_URL')}/api/integrations/etsy/oauth/callback`
  }

  /**
   * Bước 1: Generate URL để redirect user sang Etsy
   * Sử dụng PKCE Authorization Code Flow
   */
  async generateAuthUrl(userId: number): Promise<string> {
    // 1. Tạo code_verifier và code_challenge
    const codeVerifier = generateRandomString()
    const codeChallenge = generateCodeChallenge(codeVerifier)

    // 2. Tạo state ngẫu nhiên để chống CSRF
    const state = generateRandomString(32)

    // 3. Lưu mapping state -> { codeVerifier, userId } vào Redis (có TTL)
    // Để khi callback về ta verify được đúng session và lấy lại được codeVerifier
    const cacheKey = `${ETSY_OAUTH_STATE_PREFIX}${state}`
    const sessionData = { codeVerifier, userId }

    // Lưu vào Redis, hết hạn sau 10 phút
    // CacheService của bạn dùng set(key, value, ttl)
    await this.cacheService.set(cacheKey, JSON.stringify(sessionData), ETSY_OAUTH_STATE_TTL)

    // 4. Construct URL
    const params = new URLSearchParams({
      response_type: 'code',
      redirect_uri: this.redirectUri,
      scope: ETSY_SCOPES,
      client_id: this.apiKey,
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    })

    return `${ETSY_AUTH_URL}?${params.toString()}`
  }

  /**
   * Bước 2: Xử lý Callback từ Etsy
   */
  async handleCallback(code: string, state: string, error?: string) {
    if (error) {
      throw new BadRequestException(`Etsy OAuth Error: ${error}`)
    }

    if (!code || !state) {
      throw new BadRequestException('Missing code or state')
    }

    // 1. Verify State từ Redis
    const cacheKey = `${ETSY_OAUTH_STATE_PREFIX}${state}`
    const sessionRaw = await this.cacheService.get(cacheKey) as string

    if (!sessionRaw) {
      throw new BadRequestException('Invalid or expired state. Please try again.')
    }

    const { codeVerifier, userId } = JSON.parse(sessionRaw)

    // Xóa state để tránh replay attack
    await this.cacheService.del(cacheKey)

    // 2. Exchange Code lấy Token
    const tokenData = await this.exchangeCodeForToken(code, codeVerifier)

    // 3. Lấy thông tin Etsy User & Shop
    // Cần accessToken để gọi API
    const accessToken = tokenData.access_token
    const refreshToken = tokenData.refresh_token
    const expiresIn = tokenData.expires_in // seconds

    // Tính thời gian hết hạn (epoch ms)
    const tokenExpiresAt = Date.now() + expiresIn * 1000

    // Gọi API lấy User Info (__SELF__)
    const userResult = await this.etsyClient.getSelf(accessToken)
    const etsyUserId = userResult.user_id

    // Gọi API lấy Shop Info
    const shopResult = await this.etsyClient.getShopByUserId(etsyUserId, accessToken)

    if (!shopResult) {
      // Trường hợp user chưa tạo shop trên Etsy
      // Vẫn lưu user link nhưng chưa có shopId? Hoặc báo lỗi.
      // Ở đây ta báo lỗi nếu mục đích chính là quản lý shop
      throw new NotFoundException('User does not have an active Etsy Shop')
    }

    const etsyShopId = shopResult.shop_id.toString()
    const shopName = shopResult.shop_name

    // 4. Lưu / Update vào DB
    let store = await this.storeRepo.findOne({ where: { etsyShopId } })
    if (!store) {
      store = new EtsyStoreEntity()
      store.etsyShopId = etsyShopId
    }

    store.userId = userId // Liên kết với user hệ thống nest-admin
    store.etsyUserId = etsyUserId.toString()
    store.shopName = shopName
    store.accessToken = accessToken
    store.refreshToken = refreshToken
    store.tokenExpiresAt = tokenExpiresAt
    store.scopes = ETSY_SCOPES
    store.isActive = true

    await store.save()

    return store
  }

  /**
   * Trao đổi authorization_code lấy access_token
   */
  private async exchangeCodeForToken(code: string, codeVerifier: string) {
    const payload = {
      grant_type: 'authorization_code',
      client_id: this.apiKey,
      redirect_uri: this.redirectUri,
      code,
      code_verifier: codeVerifier,
    }

    try {
      const response = await lastValueFrom(
        this.httpService.post(ETSY_TOKEN_URL, payload, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }),
      )
      return response.data
    }
    catch (e) {
      this.logger.error(`Etsy Token Exchange Failed: ${e.message}`, e.response?.data)
      throw new InternalServerErrorException('Failed to exchange Etsy token')
    }
  }

  /**
   * Refesh Token Strategy
   * @param store
   */
  async refreshAccessToken(store: EtsyStoreEntity): Promise<EtsyStoreEntity> {
    const payload = {
      grant_type: 'refresh_token',
      client_id: this.apiKey,
      refresh_token: store.refreshToken,
    }

    try {
      const response = await lastValueFrom(
        this.httpService.post(ETSY_TOKEN_URL, payload, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }),
      )
      const data = response.data

      // Update Entity
      store.accessToken = data.access_token
      store.refreshToken = data.refresh_token
      store.tokenExpiresAt = Date.now() + (data.expires_in * 1000)

      return await store.save()
    }
    catch (e) {
      this.logger.error(`Etsy Refresh Token Failed for Shop ${store.etsyShopId}: ${e.message}`, e.response?.data)
      // Nếu refresh fail (ví dụ token bị revoke), có thể set isActive = false
      store.isActive = false
      await store.save()
      throw e
    }
  }
}
