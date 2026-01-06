import * as crypto from 'node:crypto'
import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ShopifyStoreEntity } from '../entities/shopify-store.entity'
import { ShopifyClientService } from './shopify-client.service'

@Injectable()
export class ShopifyOAuthService {
  private readonly logger = new Logger(ShopifyOAuthService.name)

  constructor(
    @InjectRepository(ShopifyStoreEntity)
    private readonly storeRepository: Repository<ShopifyStoreEntity>,
    private readonly shopifyClient: ShopifyClientService,
  ) {}

  /**
   * Tạo URL để redirect user sang trang cấp quyền của Shopify
   * @param shop Tên shop (vd: my-store.myshopify.com)
   * @param userId ID của user đang login
   */
  async generateAuthUrl(shop: string, userId: number): Promise<string> {
    const shopify = this.shopifyClient.getShopifyInstance()
    const cleanShop = shopify.utils.sanitizeShop(shop, true)

    if (!cleanShop) {
      throw new Error('Invalid shop domain')
    }

    // URL format: https://{shop}/admin/oauth/authorize?client_id={apiKey}&scope={scopes}&redirect_uri={redirectUri}&state={nonce}

    const isOnline = false // Offline access token (vĩnh viễn) cho background jobs

    // Tự build URL để control tốt hơn trong môi trường API (Frontend tách rời Backend)
    const redirectUri = `${process.env.APP_BASE_URL}/api/integrations/shopify/oauth/callback`

    // Gắn userId vào state để lấy lại ở callback. Format: nonce_userId
    // Fix: shopify.utils.nonce() might be unavailable in some versions, using crypto instead.
    const nonce = crypto.randomBytes(16).toString('hex')
    const state = `${nonce}__${userId}`

    // Manual construction (Safe & Standard)
    const scopes = process.env.SHOPIFY_SCOPES || 'read_products,write_products,read_orders,write_orders'
    const url = `https://${cleanShop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&grant_options[]=${isOnline ? 'per-user' : ''}`

    return url
  }

  /**
   * Xử lý callback từ Shopify sau khi user đồng ý cấp quyền
   */
  async handleCallback(shop: string, code: string, state: string): Promise<ShopifyStoreEntity> {
    const shopify = this.shopifyClient.getShopifyInstance()
    const cleanShop = shopify.utils.sanitizeShop(shop, true)

    if (!cleanShop) {
      throw new Error('Invalid shop domain')
    }

    // Exchange code lấy access token
    // Dùng library function: exchangeAccessToken
    // Cần construct session object giả lập

    try {
      // Note: Session object creation removed as it caused "not a constructor" error
      // and is not needed for manual token exchange below.

      // Token exchange
      // Note: @shopify/shopify-api v9+ thay đổi cách exchange.
      // Ta có thể dùng REST call thủ công nếu library quá cồng kềnh với req/res objects.

      // Manual Token Exchange (Gọn nhẹ hơn việc mock req/res cho library)
      const accessToken = await this.exchangeCodeForToken(cleanShop, code)

      // Extract userId from state
      const parts = state ? state.split('__') : []
      const userId = parts.length > 1 ? Number.parseInt(parts[1]) : null

      // Lưu vào DB
      let store = await this.storeRepository.findOne({ where: { shopDomain: cleanShop } })
      if (!store) {
        store = new ShopifyStoreEntity()
        store.shopDomain = cleanShop
      }

      store.accessToken = accessToken
      store.scopes = process.env.SHOPIFY_SCOPES
      store.isActive = true
      store.state = state // Lưu state lần cuối (audit)

      if (userId) {
        store.userId = userId
      }

      return await this.storeRepository.save(store)
    }
    catch (error) {
      this.logger.error(`Failed to handle Shopify callback: ${error.message}`, error.stack)
      throw error
    }
  }

  private async exchangeCodeForToken(shop: string, code: string): Promise<string> {
    const url = `https://${shop}/admin/oauth/access_token`
    const payload = {
      client_id: process.env.SHOPIFY_API_KEY,
      client_secret: process.env.SHOPIFY_API_SECRET,
      code,
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Shopify Token Error: ${text}`)
      }

      const data = await response.json() as any
      return data.access_token
    }
    catch (error) {
      throw new Error(`Could not exchange token: ${error.message}`)
    }
  }
}
