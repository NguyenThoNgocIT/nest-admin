// src/integrations/shopify/services/shopify-order.service.ts
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ShopifyStoreEntity } from '../entities/shopify-store.entity'
import { ShopifyClientService } from './shopify-client.service'

@Injectable()
export class ShopifyOrderService {
  constructor(
    @InjectRepository(ShopifyStoreEntity)
    private readonly storeRepo: Repository<ShopifyStoreEntity>,
    private readonly shopifyClient: ShopifyClientService,
  ) {}

  private async findStore(shopDomain: string, userId?: number): Promise<ShopifyStoreEntity> {
    const whereCondition: any = { shopDomain }
    if (userId) {
      whereCondition.userId = userId
    }

    const store = await this.storeRepo.findOne({ where: whereCondition })
    if (!store || !store.accessToken) {
      throw new Error(`Store ${shopDomain} invalid or access denied for User #${userId}`)
    }
    return store
  }

  /**
   * Lấy danh sách Orders
   * query: Syntax search của Shopify (vd: "created_at:>='2024-01-01' AND financial_status:paid")
   */
  async listOrders(shopDomain: string, limit = 10, searchQuery?: string, userId?: number) {
    const store = await this.findStore(shopDomain, userId)
    const client = await this.shopifyClient.getGraphqlClient(store)

    // Lưu ý: Trường `financialStatus` deprecated, dùng `displayFinancialStatus`
    // Trường `totalPriceSet` thể nhận tiền tệ shop và tiền tệ presentment
    const query = `
      query GetOrders($first: Int!, $query: String) {
        orders(first: $first, query: $query, sortKey: CREATED_AT, reverse: true) {
          edges {
            cursor
            node {
              id
              name
              createdAt
              displayFinancialStatus
              displayFulfillmentStatus
              customer {
                email
                firstName
                lastName
              }
              currentTotalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              lineItems(first: 5) {
                edges {
                  node {
                    title
                    quantity
                    sku
                  }
                }
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `

    const response = await client.query({
      data: {
        query,
        variables: {
          first: limit,
          query: searchQuery || null,
        },
      },
    })

    const { orders } = response.body.data
    return {
      items: orders.edges.map(edge => edge.node),
      pageInfo: orders.pageInfo,
    }
  }

  /**
   * Lấy chi tiết 1 Order
   */
  async getOrder(shopDomain: string, orderId: string, userId?: number) {
    const store = await this.findStore(shopDomain, userId)
    const client = await this.shopifyClient.getGraphqlClient(store)

    const query = `
      query GetOrderDetail($id: ID!) {
        order(id: $id) {
          id
          name
          note
          tags
          shippingAddress {
            address1
            city
            country
            zip
          }
        }
      }
    `
    // orderId phải là GID, ví dụ "gid://shopify/Order/123456789"
    // Nếu user truyền id số (123456789), cần convert: `gid://shopify/Order/${id}`

    const response = await client.query({
      data: {
        query,
        variables: { id: orderId },
      },
    })

    return response.body.data.order
  }
}
