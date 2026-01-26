// src/integrations/shopify/services/shopify-shop.service.ts
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ShopifyStoreEntity } from '../entities/shopify-store.entity'
import { ShopifyClientService } from './shopify-client.service'

@Injectable()
export class ShopifyShopService {
  constructor(
    @InjectRepository(ShopifyStoreEntity)
    private readonly storeRepo: Repository<ShopifyStoreEntity>,
    private readonly shopifyClient: ShopifyClientService,
  ) {}

  private async findStore(shopDomain: string, userId?: number): Promise<ShopifyStoreEntity> {
    const whereCondition: any = { shopDomain }
    if (userId)
      whereCondition.userId = userId

    const store = await this.storeRepo.findOne({ where: whereCondition })
    if (!store || !store.accessToken) {
      throw new Error(`Store chưa kết nối hoặc access denied`)
    }
    return store
  }

  /**
   * Lấy thông tin Shop chi tiết
   */
  async getShopInfo(shopDomain: string, userId?: number) {
    const store = await this.findStore(shopDomain, userId)
    const client = await this.shopifyClient.getGraphqlClient(store)

    const query = `
      query GetShopInfo {
        shop {
          id
          name
          email
          currencyCode
          myshopifyDomain
          description
          plan {
            displayName
            partnerDevelopment
          }
          primaryDomain {
            url
            host
          }
        }
      }
    `

    const response = await client.query({ data: { query } })
    return response.body.data.shop
  }
}
