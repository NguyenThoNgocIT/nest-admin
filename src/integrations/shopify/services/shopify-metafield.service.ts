import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ShopifyStoreEntity } from '../entities/shopify-store.entity'
import { ShopifyClientService } from './shopify-client.service'

@Injectable()
export class ShopifyMetafieldService {
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
   * Get Metafields attached to a Resource (Product, Customer, Order, etc.)
   * Uses the `HasMetafields` interface via `node` query.
   */
  async getMetafields(shopDomain: string, ownerId: string, userId?: number) {
    const store = await this.findStore(shopDomain, userId)
    const client = await this.shopifyClient.getGraphqlClient(store)

    const query = `
      query GetMetafields($id: ID!) {
        node(id: $id) {
          id
          ... on HasMetafields {
            metafields(first: 50) {
              edges {
                node {
                  id
                  namespace
                  key
                  value
                  type
                  description
                  updatedAt
                }
              }
            }
          }
        }
      }
    `
    // Ensure GID. The ownerId can be a Product, Customer, Order, Shop GID.
    // If user passes raw ID, it might fail unless we know type. Assuming GID is passed or we handle widely used types.
    // For specific types we can guess, but better to require GID or valid owner ID.
    const gid = ownerId

    const response = await client.query({
      data: {
        query,
        variables: { id: gid },
      },
    })

    const node = response.body.data.node
    if (!node || !node.metafields) {
      // Not found or doesn't support metafields
      return []
    }

    return node.metafields.edges.map(e => e.node)
  }

  /**
   * Set Metafields (Create or Update)
   * Using `metafieldsSet` mutation which is efficient for batching
   */
  async setMetafields(
    shopDomain: string,
    metafields: Array<{
      ownerId: string
      namespace: string
      key: string
      value: string
      type: string // e.g. 'single_line_text_field', 'json', 'number_integer'
    }>,
    userId?: number,
  ) {
    const store = await this.findStore(shopDomain, userId)
    const client = await this.shopifyClient.getGraphqlClient(store)

    const mutation = `
      mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            namespace
            key
            value
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
        variables: { metafields },
      },
    })

    const { metafieldsSet } = response.body.data
    if (metafieldsSet.userErrors?.length) {
      throw new Error(`Metafields Set error: ${JSON.stringify(metafieldsSet.userErrors)}`)
    }

    return metafieldsSet.metafields
  }

  /**
   * Delete Metafield by ID
   */
  async deleteMetafield(shopDomain: string, id: string, userId?: number) {
    const store = await this.findStore(shopDomain, userId)
    const client = await this.shopifyClient.getGraphqlClient(store)

    const mutation = `
      mutation MetafieldDelete($id: ID!) {
        metafieldDelete(id: $id) {
          deletedId
          userErrors {
            field
            message
          }
        }
      }
    `

    // Metafield ID must be a GID
    const gid = id.startsWith('gid://') ? id : `gid://shopify/Metafield/${id}`

    const response = await client.query({
      data: {
        query: mutation,
        variables: { id: gid },
      },
    })

    const { metafieldDelete } = response.body.data
    if (metafieldDelete.userErrors?.length) {
      throw new Error(`Metafield Delete error: ${JSON.stringify(metafieldDelete.userErrors)}`)
    }

    return metafieldDelete.deletedId
  }
}
