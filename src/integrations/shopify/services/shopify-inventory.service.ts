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

  /**
   * Set số lượng OnHand (inventorySetOnHandQuantities)
   * Đây là cách mới thay thế inventorySetQuantity deprecated
   */
  async setOnHandQuantities(
    shopDomain: string,
    inputs: Array<{
      inventoryItemId: string
      locationId: string
      quantity: number
    }>,
    userId?: number,
    reason = 'correction',
  ) {
    const store = await this.findStore(shopDomain, userId)
    const client = await this.shopifyClient.getGraphqlClient(store)

    const mutation = `
      mutation InventorySetOnHandQuantities($input: InventorySetOnHandQuantitiesInput!) {
        inventorySetOnHandQuantities(input: $input) {
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

    const setQuantities = inputs.map(i => ({
      inventoryItemId: i.inventoryItemId,
      locationId: i.locationId,
      quantity: i.quantity,
    }))

    const response = await client.query({
      data: {
        query: mutation,
        variables: {
          input: {
            reason,
            setQuantities,
          },
        },
      },
    })

    const { inventorySetOnHandQuantities } = response.body.data
    if (inventorySetOnHandQuantities.userErrors?.length) {
      throw new Error(
        `Set OnHand error: ${JSON.stringify(inventorySetOnHandQuantities.userErrors)}`,
      )
    }

    return inventorySetOnHandQuantities.inventoryAdjustmentGroup
  }

  /**
   * Activate inventory item at a location
   */
  async activateInventoryItem(
    shopDomain: string,
    inventoryItemId: string,
    locationId: string,
    userId?: number,
  ) {
    const store = await this.findStore(shopDomain, userId)
    const client = await this.shopifyClient.getGraphqlClient(store)

    const mutation = `
      mutation InventoryActivate($inventoryItemId: ID!, $locationId: ID!) {
        inventoryActivate(inventoryItemId: $inventoryItemId, locationId: $locationId) {
          inventoryLevel {
            id
            quantities(names: ["available", "on_hand"]) {
              name
              quantity
            }
            location {
              id
              name
            }
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
        variables: { inventoryItemId, locationId },
      },
    })

    const { inventoryActivate } = response.body.data
    if (inventoryActivate.userErrors?.length) {
      throw new Error(`Activate error: ${JSON.stringify(inventoryActivate.userErrors)}`)
    }

    return inventoryActivate.inventoryLevel
  }

  /**
   * Deactivate inventory item at a location
   */
  async deactivateInventoryItem(
    shopDomain: string,
    inventoryItemId: string,
    locationId: string,
    userId?: number,
  ) {
    const store = await this.findStore(shopDomain, userId)
    const client = await this.shopifyClient.getGraphqlClient(store)

    const mutation = `
      mutation InventoryDeactivate($inventoryItemId: ID!, $locationId: ID!) {
        inventoryDeactivate(inventoryItemId: $inventoryItemId, locationId: $locationId) {
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
        variables: { inventoryItemId, locationId },
      },
    })

    const { inventoryDeactivate } = response.body.data
    if (inventoryDeactivate.userErrors?.length) {
      throw new Error(`Deactivate error: ${JSON.stringify(inventoryDeactivate.userErrors)}`)
    }

    return true
  }

  /**
   * Lấy thông tin InventoryItem (cost, tracked, countryCode)
   */
  async getInventoryItem(shopDomain: string, inventoryItemId: string, userId?: number) {
    const store = await this.findStore(shopDomain, userId)
    const client = await this.shopifyClient.getGraphqlClient(store)

    const query = `
      query GetInventoryItem($id: ID!) {
        inventoryItem(id: $id) {
          id
          sku
          tracked
          unitCost {
            amount
            currencyCode
          }
          countryCodeOfOrigin
          provinceCodeOfOrigin
          inventoryLevels(first: 20) {
            edges {
              node {
                id
                quantities(names: ["available", "on_hand", "committed"]) {
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
    `
    const gid = inventoryItemId.startsWith('gid://')
      ? inventoryItemId
      : `gid://shopify/InventoryItem/${inventoryItemId}`

    const response = await client.query({
      data: {
        query,
        variables: { id: gid },
      },
    })

    return response.body.data.inventoryItem
  }
}
