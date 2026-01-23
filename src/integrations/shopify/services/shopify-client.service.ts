import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { LATEST_API_VERSION, Session, shopifyApi } from '@shopify/shopify-api'
import { ShopifyStoreEntity } from '../entities/shopify-store.entity'
import '@shopify/shopify-api/adapters/node'

@Injectable()
export class ShopifyClientService {
  private readonly logger = new Logger(ShopifyClientService.name)
  private shopify

  constructor(private readonly configService: ConfigService) {
    this.initializeShopify()
  }

  private initializeShopify() {
    const apiKey = this.configService.get<string>('SHOPIFY_API_KEY')
    const apiSecretKey = this.configService.get<string>('SHOPIFY_API_SECRET')
    const hostName = this.configService.get<string>('APP_BASE_URL').replace(/^https?:\/\//, '')
    const scopeEnv = this.configService.get<string>('SHOPIFY_SCOPES') || ''
    const scopes = scopeEnv.split(',').map(s => s.trim()).filter(s => s.length > 0)

    if (!apiKey || !apiSecretKey) {
      this.logger.warn('Thiếu cấu hình SHOPIFY_API_KEY hoặc SHOPIFY_API_SECRET. Module Shopify có thể không hoạt động đúng.')
      return
    }

    this.shopify = shopifyApi({
      apiKey,
      apiSecretKey,
      scopes: [], // Scopes sẽ được xử lý động khi auth
      hostName,
      apiVersion: LATEST_API_VERSION,
      isEmbeddedApp: false,
    })
  }

  getShopifyInstance() {
    return this.shopify
  }

  /**
   * Tạo session từ thông tin store trong DB để gọi API
   */
  async getSession(store: ShopifyStoreEntity): Promise<Session> {
    if (!this.shopify) {
      this.initializeShopify()
    }

    const session = new Session({
      id: `offline_${store.shopDomain}`,
      shop: store.shopDomain,
      state: store.state || '',
      isOnline: false, // Offline access token (vĩnh viễn)
      accessToken: store.accessToken,
      scope: store.scopes,
    })

    return session
  }

  /**
   * Lấy REST Client để gọi Admin API
   */
  async getRestClient(store: ShopifyStoreEntity) {
    const session = await this.getSession(store)
    return new this.shopify.clients.Rest({ session })
  }

  /**
   * Lấy GraphQL Client
   */
  async getGraphqlClient(store: ShopifyStoreEntity) {
    const session = await this.getSession(store)
    return new this.shopify.clients.Graphql({ session })
  }
}
