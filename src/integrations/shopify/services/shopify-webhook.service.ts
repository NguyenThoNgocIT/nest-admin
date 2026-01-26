import * as crypto from 'node:crypto'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ShopifyStoreEntity } from '../entities/shopify-store.entity'
import { ShopifyClientService } from './shopify-client.service'

@Injectable()
export class ShopifyWebhookService {
  private readonly logger = new Logger(ShopifyWebhookService.name)

  constructor(
    @InjectRepository(ShopifyStoreEntity)
    private readonly storeRepo: Repository<ShopifyStoreEntity>,
    private readonly shopifyClient: ShopifyClientService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Verify HMAC webhook signature
   * @param rawBody Buffer or string raw body from request
   * @param hmacHeader Value of X-Shopify-Hmac-Sha256 header
   */
  verifyHmac(rawBody: string | Buffer, hmacHeader: string): boolean {
    const secret = this.config.get<string>('SHOPIFY_API_SECRET')
    if (!secret || !hmacHeader)
      return false

    // Lưu ý: data phải là buffer raw từ request
    const digest = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('base64')

    return crypto.timingSafeEqual(
      Buffer.from(digest),
      Buffer.from(hmacHeader),
    )
  }

  /**
   * Đăng ký Webhook Products (Create/Update/Delete)
   */
  async registerProductWebhooks(shopDomain: string) {
    const store = await this.storeRepo.findOne({ where: { shopDomain } })
    if (!store || !store.accessToken)
      throw new Error('Store not connected')

    const client = await this.shopifyClient.getGraphqlClient(store)

    // Callback URL trỏ về endpoint của bạn
    const apiBase = this.config.get<string>('APP_BASE_URL') || 'https://your-domain.com'
    const webhookCallbackUrl = `${apiBase}/api/integrations/shopify/webhooks/products`

    const mutation = `
      mutation CreateProductWebhooks($webhookCallbackUrl: String!) {
        productCreate: webhookSubscriptionCreate(
          topic: PRODUCTS_CREATE,
          webhookSubscription: { uri: $webhookCallbackUrl, format: JSON }
        ) {
          webhookSubscription { id }
          userErrors { field message }
        }

        productUpdate: webhookSubscriptionCreate(
          topic: PRODUCTS_UPDATE,
          webhookSubscription: { uri: $webhookCallbackUrl, format: JSON }
        ) {
          webhookSubscription { id }
          userErrors { field message }
        }

        productDelete: webhookSubscriptionCreate(
          topic: PRODUCTS_DELETE,
          webhookSubscription: { uri: $webhookCallbackUrl, format: JSON }
        ) {
          webhookSubscription { id }
          userErrors { field message }
        }
      }
    `

    this.logger.log(`Registering webhooks for ${shopDomain} -> ${webhookCallbackUrl}`)

    const res = await client.query({
      data: {
        query: mutation,
        variables: { webhookCallbackUrl },
      },
    })

    const data = res.body.data
    // Log result
    if (data.productCreate?.userErrors?.length)
      this.logger.warn(`Registered PRODUCTS_CREATE failed: ${JSON.stringify(data.productCreate.userErrors)}`)
    if (data.productUpdate?.userErrors?.length)
      this.logger.warn(`Registered PRODUCTS_UPDATE failed: ${JSON.stringify(data.productUpdate.userErrors)}`)
    if (data.productDelete?.userErrors?.length)
      this.logger.warn(`Registered PRODUCTS_DELETE failed: ${JSON.stringify(data.productDelete.userErrors)}`)

    return data
  }

  /**
   * Đăng ký Webhook Order & Inventory
   * Gồm: ORDERS_CREATE, ORDERS_UPDATED, INVENTORY_LEVELS_UPDATE
   */
  async registerOrderWebhooks(shopDomain: string) {
    const store = await this.storeRepo.findOne({ where: { shopDomain } })
    if (!store || !store.accessToken)
      throw new Error('Store not connected')

    const client = await this.shopifyClient.getGraphqlClient(store)

    // Sử dụng chung callback URL hoặc tách riêng tuỳ ý.
    // Ở đây mình tách endpoint /orders để dễ quản lý ở Controller
    const apiBase = this.config.get<string>('APP_BASE_URL') || 'https://your-domain.com'
    const webhookCallbackUrl = `${apiBase}/api/integrations/shopify/webhooks/orders`

    const mutation = `
      mutation CreateOrderAndInventoryWebhooks($webhookCallbackUrl: String!) {
        ordersCreate: webhookSubscriptionCreate(
          topic: ORDERS_CREATE,
          webhookSubscription: { uri: $webhookCallbackUrl, format: JSON }
        ) {
          webhookSubscription { id }
          userErrors { field message }
        }

        ordersUpdated: webhookSubscriptionCreate(
          topic: ORDERS_UPDATED,
          webhookSubscription: { uri: $webhookCallbackUrl, format: JSON }
        ) {
          webhookSubscription { id }
          userErrors { field message }
        }

        inventoryLevelsUpdate: webhookSubscriptionCreate(
          topic: INVENTORY_LEVELS_UPDATE,
          webhookSubscription: { uri: $webhookCallbackUrl, format: JSON }
        ) {
          webhookSubscription { id }
          userErrors { field message }
        }
      }
    `

    this.logger.log(`Registering Order webhooks for ${shopDomain} -> ${webhookCallbackUrl}`)

    const res = await client.query({
      data: {
        query: mutation,
        variables: { webhookCallbackUrl },
      },
    })

    const data = res.body.data
    // Log result
    if (data.ordersCreate?.userErrors?.length)
      this.logger.warn(`Registered ORDERS_CREATE failed: ${JSON.stringify(data.ordersCreate.userErrors)}`)
    if (data.ordersUpdated?.userErrors?.length)
      this.logger.warn(`Registered ORDERS_UPDATED failed: ${JSON.stringify(data.ordersUpdated.userErrors)}`)
    if (data.inventoryLevelsUpdate?.userErrors?.length)
      this.logger.warn(`Registered INVENTORY_LEVELS_UPDATE failed: ${JSON.stringify(data.inventoryLevelsUpdate.userErrors)}`)

    return data
  }

  /**
   * Xử lý sự kiện từ Webhook
   */
  async handleProductEvent(topic: string, shopDomain: string, payload: any) {
    this.logger.log(`Received Webhook ${topic} from ${shopDomain}`)

    // TODO: Implement logic sync data vào DB
    switch (topic) {
      case 'products/create':
        // this.syncService.upsertProduct(shopDomain, payload)
        this.logger.log(`Sync Create Product: ${payload.id}`)
        break
      case 'products/update':
        // this.syncService.upsertProduct(shopDomain, payload)
        this.logger.log(`Sync Update Product: ${payload.id}`)
        break
      case 'products/delete':
        // this.syncService.deleteProduct(shopDomain, payload.id)
        this.logger.log(`Sync Delete Product: ${payload.id}`)
        break
      default:
        this.logger.warn(`Unknown product topic: ${topic}`)
    }
  }

  /**
   * Xử lý sự kiện từ Order & Inventory Webhook
   */
  async handleOrderEvent(topic: string, shopDomain: string, payload: any) {
    this.logger.log(`Received Order Webhook ${topic} from ${shopDomain}`)

    switch (topic) {
      case 'orders/create':
        this.logger.log(`Sync Create Order: ${payload.id}`)
        // TODO: Lưu order vào DB, trigger sync
        break
      case 'orders/updated':
        this.logger.log(`Sync Update Order: ${payload.id}`)
        // TODO: Update trạng thái đơn
        break
      case 'inventory_levels/update':
        this.logger.log(`Sync Inventory Level: item ${payload.inventory_item_id} at location ${payload.location_id}`)
        // TODO: Cập nhật tồn kho nội bộ
        break
      default:
        this.logger.warn(`Unknown order topic: ${topic}`)
    }
  }
}
