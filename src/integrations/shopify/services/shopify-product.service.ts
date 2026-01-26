// src/integrations/shopify/services/shopify-product.service.ts
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ShopifyStoreEntity } from '../entities/shopify-store.entity'
import { ShopifyClientService } from './shopify-client.service'

@Injectable()
export class ShopifyProductService {
  constructor(
    @InjectRepository(ShopifyStoreEntity)
    private readonly storeRepo: Repository<ShopifyStoreEntity>,
    private readonly shopifyClient: ShopifyClientService,
  ) {}

  /**
   * Helper tìm store
   */
  private async findStore(shopDomain: string, userId?: number): Promise<ShopifyStoreEntity> {
    const whereCondition: any = { shopDomain }
    if (userId) {
      whereCondition.userId = userId
    }

    const store = await this.storeRepo.findOne({ where: whereCondition })
    if (!store) {
      if (userId)
        throw new Error(`Store ${shopDomain} không tìm thấy hoặc không thuộc User #${userId}`)
      throw new Error(`Store ${shopDomain} chưa được kết nối`)
    }
    if (!store.accessToken)
      throw new Error(`Store ${shopDomain} thiếu access token`)
    return store
  }

  /**
   * Lấy danh sách products
   * Sử dụng GraphQL connection với cursor-based pagination (cơ bản dùng first/after nhưng ở đây demo simple first/query)
   */
  async listProducts(shopDomain: string, limit = 10, searchQuery?: string, userId?: number) {
    const store = await this.findStore(shopDomain, userId)
    const client = await this.shopifyClient.getGraphqlClient(store)

    const query = `
      query GetProducts($first: Int!, $query: String) {
        products(first: $first, query: $query, sortKey: TITLE) {
          edges {
            cursor
            node {
              id
              title
              status
              totalInventory
              featuredImage {
                url
              }
              variants(first: 1) {
                edges {
                  node {
                    price
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
          query: searchQuery || null, // Nếu rỗng thì truyền null để lấy tất cả
        },
      },
    })

    // Return format tiện dụng hơn
    const { products } = response.body.data
    return {
      items: products.edges.map(edge => edge.node),
      pageInfo: products.pageInfo,
    }
  }

  /**
   * Tạo Product mới
   */
  async createProduct(shopDomain: string, productInput: any, userId?: number) {
    const store = await this.findStore(shopDomain, userId)
    const client = await this.shopifyClient.getGraphqlClient(store)

    const mutation = `
      mutation CreateProduct($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product {
            id
            title
            status
            handle
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const response = await client.query({
      data: {
        query: mutation,
        variables: {
          product: productInput,
        },
      },
    })

    const { productCreate } = response.body.data

    if (productCreate.userErrors && productCreate.userErrors.length > 0) {
      const errors = productCreate.userErrors.map(e => e.message).join(', ')
      throw new Error(`Shopify Create Product Failed: ${errors}`)
    }

    return productCreate.product
  }
}
