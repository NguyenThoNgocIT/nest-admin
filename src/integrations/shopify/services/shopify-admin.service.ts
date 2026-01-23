// src/modules/integrations/shopify/services/shopify-admin.service.ts
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ShopifyStoreEntity } from '../entities/shopify-store.entity'
import { ShopifyClientService } from './shopify-client.service'

@Injectable()
export class ShopifyAdminService {
  constructor(
    @InjectRepository(ShopifyStoreEntity)
    private readonly storeRepo: Repository<ShopifyStoreEntity>,
    private readonly shopifyClient: ShopifyClientService,
  ) {}

  /**
   * Lấy danh sách các store thuộc về một userId cụ thể
   */
  async getStoresByUserId(userId: number): Promise<ShopifyStoreEntity[]> {
    return this.storeRepo.find({ where: { userId } })
  }

  /**
   * Tìm store trong DB.
   * Nếu truyền userId, sẽ kiểm tra xem store đó có thuộc userId đó không.
   */
  private async findStore(shopDomain: string, userId?: number): Promise<ShopifyStoreEntity> {
    const whereCondition: any = { shopDomain }

    // Nếu có userId, thêm điều kiện user_id vào query
    if (userId) {
      whereCondition.userId = userId
    }

    const store = await this.storeRepo.findOne({ where: whereCondition })

    if (!store) {
      if (userId) {
        throw new Error(`Store ${shopDomain} không tồn tại hoặc không thuộc quyền quản lý của User #${userId}`)
      }
      throw new Error(`Store ${shopDomain} chưa được kết nối`)
    }

    if (!store.accessToken) {
      throw new Error(`Store ${shopDomain} thiếu access token`)
    }

    return store
  }

  /**
   * Gửi GraphQL bất kỳ (nếu bạn muốn có 1 hàm generic)
   */
  private async graphqlRequest<T = any>(
    store: ShopifyStoreEntity,
    query: string,
    variables?: Record<string, any>,
  ): Promise<T> {
    const client = await this.shopifyClient.getGraphqlClient(store)

    const response = await client.query({
      data: { query, variables },
    })

    return response.body as T
  }

  /**
   * 1) Lấy thông tin shop (để test connect)
   */
  async getShopInfo(shopDomain: string, userId?: number) {
    const store = await this.findStore(shopDomain, userId)

    const query = `
      query GetShopInfo {
        shop {
          id
          name
          myshopifyDomain
        }
      }
    `

    const data = await this.graphqlRequest<{ data: { shop: any } }>(store, query)
    return data.data.shop
  }

  /**
   * 2) Lấy danh sách products (thay cho REST GET /products.json)
   */
  async listProducts(shopDomain: string, first = 10, searchQuery?: string, userId?: number) {
    const store = await this.findStore(shopDomain, userId)

    const query = `
      query GetProducts($first: Int!, $query: String) {
        products(first: $first, query: $query) {
          edges {
            node {
              id
              title
              status
              totalInventory
            }
          }
        }
      }
    `

    const data = await this.graphqlRequest<{
      data: { products: { edges: Array<{ node: any }> } }
    }>(store, query, { first, query: searchQuery })

    return data.data.products.edges.map(edge => edge.node)
  }

  /**
   * 3) Tạo product (thay cho REST POST /products.json)
   */
  async createProduct(shopDomain: string, productInput: any, userId?: number) {
    const store = await this.findStore(shopDomain, userId)

    const mutation = `
      mutation CreateProduct($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product {
            id
            title
            status
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const data = await this.graphqlRequest<{
      data: {
        productCreate: {
          product: any
          userErrors: Array<{ field: string[], message: string }>
        }
      }
    }>(store, mutation, { product: productInput })

    const result = data.data.productCreate

    if (result.userErrors && result.userErrors.length > 0) {
      throw new Error(result.userErrors.map(e => e.message).join(', '))
    }

    return result.product
  }

  /**
   * 4) Lấy danh sách orders (thay cho REST GET /orders.json)
   */
  async listOrders(shopDomain: string, first = 10, searchQuery?: string, userId?: number) {
    const store = await this.findStore(shopDomain, userId)

    const query = `
      query GetOrders($first: Int!, $query: String) {
        orders(first: $first, query: $query, sortKey: CREATED_AT, reverse: true) {
          edges {
            node {
              id
              name
              createdAt
              totalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    `

    const data = await this.graphqlRequest<{
      data: { orders: { edges: Array<{ node: any }> } }
    }>(store, query, { first, query: searchQuery })

    return data.data.orders.edges.map(edge => edge.node)
  }
}
