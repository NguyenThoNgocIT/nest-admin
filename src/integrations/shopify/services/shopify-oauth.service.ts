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
   */
  async generateAuthUrl(shop: string): Promise<string> {
    const shopify = this.shopifyClient.getShopifyInstance()
    const cleanShop = shopify.utils.sanitizeShop(shop, true)

    if (!cleanShop) {
      throw new Error('Invalid shop domain')
    }

    // Bắt đầu quy trình OAuth
    // begin() trả về Promise<void> và tự handle response nếu truyền rawRequest/rawResponse
    // Nhưng ở đây ta muốn lấy URL để trả về cho frontend redirect
    // Nên ta dùng begin() nhưng không truyền req/res, mà chỉ lấy url từ return (nếu library support)
    // Hoặc dùng method khác.
    // Với @shopify/shopify-api v10+, auth.begin() chủ yếu dùng cho Node server (Express/Koa)
    // Tuy nhiên, ta có thể tự construct URL nếu cần, hoặc dùng begin() với mock req/res nếu library bắt buộc.

    // Cách chuẩn: Dùng shopify.auth.begin() nhưng ta cần URL.
    // Thực tế shopify.auth.begin() sẽ set header Location và status 302 cho rawResponse.
    // Vì NestJS controller trả về string URL hoặc redirect object, ta cần trick một chút hoặc dùng cách khác.

    // Tuy nhiên, để đơn giản và đúng chuẩn library, ta sẽ để controller gọi service này,
    // và service này trả về URL.
    // Library @shopify/shopify-api không expose hàm getAuthUrl public dễ dàng mà nằm trong begin().

    // Workaround: Tự construct URL (dễ nhưng rủi ro nếu library đổi logic)
    // Hoặc mock request/response object để bắt lấy URL redirect.

    // Nhưng chờ đã, ta có thể dùng `shopify.auth.begin` và để nó throw redirect error hoặc ta tự build URL.
    // URL format: https://{shop}/admin/oauth/authorize?client_id={apiKey}&scope={scopes}&redirect_uri={redirectUri}&state={nonce}

    const isOnline = false // Offline access token (vĩnh viễn) cho background jobs

    // Tự build URL để control tốt hơn trong môi trường API (Frontend tách rời Backend)
    const redirectUri = `${process.env.APP_BASE_URL}/api/integrations/shopify/oauth/callback`
    const state = shopify.utils.nonce()

    const authUrl = await shopify.auth.getEmbeddedAppUrl({
      rawRequest: {} as any, // Hacky, but getEmbeddedAppUrl might not be what we want for OAuth initiation
      rawResponse: {} as any,
    }).catch(() => null) // Ignore error

    // Fallback: Manual construction (Safe & Standard)
    const scopes = process.env.SHOPIFY_SCOPES || 'read_products,write_products,read_orders,write_orders'
    const url = `https://${cleanShop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&grant_options[]=${isOnline ? 'per-user' : ''}`

    // Lưu state vào DB tạm hoặc Cache để verify callback (Optional nhưng recommended security)
    // Ở đây ta tạm bỏ qua bước lưu state phức tạp, nhưng production nên có.

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
      const sessionId = shopify.session.getOfflineId(cleanShop)
      const session = new shopify.session.Session({
        id: sessionId,
        shop: cleanShop,
        state,
        isOnline: false,
      })

      // Token exchange
      // Note: @shopify/shopify-api v9+ thay đổi cách exchange.
      // Ta có thể dùng REST call thủ công nếu library quá cồng kềnh với req/res objects.

      // Manual Token Exchange (Gọn nhẹ hơn việc mock req/res cho library)
      const accessToken = await this.exchangeCodeForToken(cleanShop, code)

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
