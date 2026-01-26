import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ShopifyStoreEntity } from '../entities/shopify-store.entity'
import { ShopifyClientService } from './shopify-client.service'

@Injectable()
export class ShopifyInventoryService {
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
      throw new Error(`Store ${shopDomain} invalid or access denied`)
    }
    return store
  }

  /**
   * Lấy tồn kho của 1 variant theo locations
   */
  async getVariantInventory(shopDomain: string, variantId: string, userId?: number) {
    const store = await this.findStore(shopDomain, userId)
    const client = await this.shopifyClient.getGraphqlClient(store)

    const query = `
      query GetVariantInventory($variantId: ID!) {
        productVariant(id: $variantId) {
          id
          title
          sku
          inventoryItem {
            id
            inventoryLevels(first: 10) {
              edges {
                node {
                  id
                  quantities(names: ["available"]) {
                    name
                    quantity
                  }
                  location {
                    id
                    name
                  }
                }
              }
            }
          }
        }
      }
    `
    // Ensure GID
    const gid = variantId.startsWith('gid://') ? variantId : `gid://shopify/ProductVariant/${variantId}`

    const response = await client.query({
      data: {
        query,
        variables: { variantId: gid },
      },
    })

    return response.body.data.productVariant
  }

  /**
   * List tất cả Locations của shop
   */
  async listLocations(shopDomain: string, userId?: number) {
    const store = await this.findStore(shopDomain, userId)
    const client = await this.shopifyClient.getGraphqlClient(store)

    const query = `
      query ListLocations {
        locations(first: 20, includeInactive: false) {
          edges {
            node {
              id
              name
              isActive
              address {
                city
                country
              }
            }
          }
        }
      }
    `
    const res = await client.query({ data: { query } })
    return res.body.data.locations.edges.map(e => e.node)
  }

  /**
   * Điều chỉnh tồn kho (Set available quantity)
   */
  async adjustInventory(
    shopDomain: string,
    changes: Array<{
      inventoryItemId: string
      locationId: string
      delta: number
    }>,
    userId?: number,
    reason = 'correction',
  ) {
    const store = await this.findStore(shopDomain, userId)
    const client = await this.shopifyClient.getGraphqlClient(store)

    const mutation = `
      mutation AdjustInventory($input: InventoryAdjustQuantitiesInput!) {
        inventoryAdjustQuantities(input: $input) {
          inventoryAdjustmentGroup {
            reason
            changes {
              name
              delta
              quantityAfterChange
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const input = {
      reason,
      changes: changes.map(c => ({
        inventoryItemId: c.inventoryItemId,
        locationId: c.locationId,
        delta: c.delta,
        name: 'available',
      })),
    }

    const response = await client.query({
      data: {
        query: mutation,
        variables: { input },
      },
    })

    const { inventoryAdjustQuantities } = response.body.data
    if (inventoryAdjustQuantities.userErrors?.length) {
      throw new Error(`Inventory Adjust error: ${JSON.stringify(inventoryAdjustQuantities.userErrors)}`)
    }

    return inventoryAdjustQuantities.inventoryAdjustmentGroup
  }
}
