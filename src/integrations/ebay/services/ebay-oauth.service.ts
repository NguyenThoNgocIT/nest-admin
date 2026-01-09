import { randomUUID } from 'node:crypto'
import { HttpService } from '@nestjs/axios'
import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { lastValueFrom } from 'rxjs'
import { Repository } from 'typeorm'
import { CacheService } from '~/shared/redis/cache.service'

import {
  EBAY_CONFIG,
  EBAY_MARKETPLACES,
  EBAY_OAUTH_STATE_PREFIX,
  EBAY_SCOPES,
  EBAY_STATE_TTL,
} from '../constants/ebay.constant'
import { EbayStoreEntity } from '../entities/ebay-store.entity'

@Injectable()
export class EbayOAuthService {
  private readonly logger = new Logger(EbayOAuthService.name)
  private readonly clientId: string
  private readonly clientSecret: string
  private readonly redirectUri: string
  private readonly environment: 'SANDBOX' | 'PRODUCTION'

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(EbayStoreEntity)
    private readonly storeRepo: Repository<EbayStoreEntity>,
    private readonly cacheService: CacheService,
    private readonly httpService: HttpService,
  ) {
    this.clientId = this.configService.get('EBAY_CLIENT_ID') || this.configService.get('SANDBOX_EBAY_CLIENT_ID')
    this.clientSecret = this.configService.get('EBAY_CLIENT_SECRET') || this.configService.get('SANDBOX_EBAY_CLIENT_SECRET')
    this.redirectUri = this.configService.get('EBAY_REDIRECT_URI') || this.configService.get('SANDBOX_EBAY_REDIRECT_URI')
    this.environment = (this.configService.get('EBAY_ENV') as 'SANDBOX' | 'PRODUCTION') || 'SANDBOX'
  }

  /**
   * 🚀 STEP 1: Generate authorization URL
   */
  async getAuthorizationUrl(userId: number): Promise<string> {
    // Generate random state (CSRF protection)
    const state = randomUUID()

    // Save state → userId mapping (TTL 10 minutes)
    const cacheKey = `${EBAY_OAUTH_STATE_PREFIX}${state}`
    await this.cacheService.set(cacheKey, userId.toString(), EBAY_STATE_TTL)

    // Build authorization URL
    // Lưu ý: Redirect URI phải chính xác 100% so với đăng ký trên eBay portal
    // Và phải là HTTPS (trừ localhost sandbox đôi khi châm chước nhưng tốt nhất là HTTPS qua Ngrok)
    const authHubUrl = EBAY_CONFIG[this.environment].AUTH_URL
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      scope: EBAY_SCOPES.join(' '),
      state,
      prompt: 'login', // Force re-authentication để user chọn tài khoản
    })

    return `${authHubUrl}?${params.toString()}`
  }

  /**
   * 🔄 STEP 2: Handle OAuth callback
   */
  async handleCallback(code: string, state: string): Promise<EbayStoreEntity> {
    // Validate state (CSRF check)
    const cacheKey = `${EBAY_OAUTH_STATE_PREFIX}${state}`
    const userIdRaw = await this.cacheService.get(cacheKey)

    if (!userIdRaw) {
      throw new BadRequestException('Invalid or expired state. Please try again.')
    }

    // Consume state (one-time use)
    await this.cacheService.del(cacheKey)
    const userId = Number.parseInt(userIdRaw as string)

    // Exchange code for tokens
    const tokenData = await this.exchangeCodeForTokens(code)

    // Get eBay user info (CRITICAL - lấy ebayUserId)
    const userInfo = await this.getUserInfo(tokenData.access_token)

    // Check if store already exists (prevent duplicate)
    let store = await this.storeRepo.findOne({
      where: {
        userId,
        ebayUserId: userInfo.userId,
      },
    })

    if (store) {
      // Update existing store (reconnect case)
      store.accessToken = tokenData.access_token
      store.refreshToken = tokenData.refresh_token
      store.tokenExpiresAt = new Date(Date.now() + tokenData.expires_in * 1000)
      store.status = 'active'
    }
    else {
      // Create new store
      store = new EbayStoreEntity()
      store.userId = userId
      store.ebayUserId = userInfo.userId
      store.username = userInfo.username
      store.marketplaceId = EBAY_MARKETPLACES.EBAY_US // Default, có thể mở rộng sau
      store.accessToken = tokenData.access_token
      store.refreshToken = tokenData.refresh_token
      store.tokenExpiresAt = new Date(Date.now() + tokenData.expires_in * 1000)
      store.scopes = EBAY_SCOPES
      store.status = 'active'
    }

    return await store.save()
  }

  /**
   * 🔑 Exchange authorization code for tokens
   */
  private async exchangeCodeForTokens(code: string) {
    const tokenUrl = EBAY_CONFIG[this.environment].TOKEN_URL
    // Basic Auth: base64(client_id:client_secret)
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')

    try {
      const response = await lastValueFrom(
        this.httpService.post(
          tokenUrl,
          new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: this.redirectUri,
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${auth}`,
            },
          },
        ),
      )

      return response.data
    }
    catch (error) {
      this.logger.error(`Failed to exchange code for tokens: ${error.message}`, error.response?.data)
      throw new UnauthorizedException('Failed to exchange code for tokens')
    }
  }

  /**
   * 👤 Get eBay user info (BẮT BUỘC - lấy ebayUserId)
   */
  private async getUserInfo(accessToken: string) {
    // Sandbox or Production based on config
    const isSandbox = this.environment === 'SANDBOX'
    const apiBase = isSandbox
      ? 'https://apiz.sandbox.ebay.com' // Correct Sandbox API URL
      : EBAY_CONFIG[this.environment].API_BASE

    try {
      // API: https://api.ebay.com/commerce/identity/v1/user/
      const response = await lastValueFrom(
        this.httpService.get(`${apiBase}/commerce/identity/v1/user/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            // Accept: 'application/json', // Optional but good practice
          },
        }),
      )

      return {
        userId: response.data.userId,
        username: response.data.username,
      }
    }
    catch (error) {
      this.logger.error(`Failed to fetch user info: ${error.message}`, error.response?.data)
      throw new UnauthorizedException('Failed to fetch user info')
    }
  }

  /**
   * 🔄 Refresh access token (non-rotating)
   */
  async refreshAccessToken(store: EbayStoreEntity): Promise<EbayStoreEntity> {
    const tokenUrl = EBAY_CONFIG[this.environment].TOKEN_URL
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')

    try {
      // Scopes phải gom về string space-separated
      // Một số trường hợp refresh token request không cần scope nếu muốn giữ nguyên scope cũ
      const scopeString = Array.isArray(store.scopes) ? store.scopes.join(' ') : store.scopes

      const response = await lastValueFrom(
        this.httpService.post(
          tokenUrl,
          new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: store.refreshToken,
            scope: scopeString,
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${auth}`,
            },
          },
        ),
      )

      // ⚠️ eBay refresh token KHÔNG rotate (khác Etsy) -> Refresh token giữ nguyên
      // Chỉ cập nhật access_token + expires_at
      store.accessToken = response.data.access_token
      store.tokenExpiresAt = new Date(Date.now() + response.data.expires_in * 1000)

      return await store.save()
    }
    catch (error) {
      this.logger.error(`Refresh token expired or revoked for store ${store.id}: ${error.message}`)
      store.status = 'revoked'
      await store.save()
      throw new UnauthorizedException('Refresh token expired or revoked')
    }
  }
}
