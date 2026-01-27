import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ShopifyStoreEntity } from '../entities/shopify-store.entity'
import { ShopifyClientService } from './shopify-client.service'

@Injectable()
export class ShopifyCustomerService {
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
   * List Customer
   */
  async listCustomers(
    shopDomain: string,
    limit = 10,
    searchQuery?: string,
    userId?: number,
  ) {
    const store = await this.findStore(shopDomain, userId)
    const client = await this.shopifyClient.getGraphqlClient(store)

    const query = `
      query ListCustomers($first: Int!, $query: String) {
        customers(first: $first, query: $query, sortKey: CREATED_AT, reverse: true) {
          edges {
            node {
              id
              firstName
              lastName
              email
              phone
              ordersCount
              totalSpent
              currency
              createdAt
              defaultAddress {
                city
                country
              }
            }
          }
        }
      }
    `

    const response = await client.query({
      data: {
        query,
        variables: { first: limit, query: searchQuery },
      },
    })

    return response.body.data.customers.edges.map(e => e.node)
  }

  /**
   * Get Customer Detail
   */
  async getCustomer(shopDomain: string, id: string, userId?: number) {
    const store = await this.findStore(shopDomain, userId)
    const client = await this.shopifyClient.getGraphqlClient(store)

    const query = `
      query GetCustomer($id: ID!) {
        customer(id: $id) {
          id
          firstName
          lastName
          email
          phone
          note
          tags
          verifiedEmail
          taxExempt
          lifetimeDuration
          createdAt
          addresses(first: 5) {
            id
            address1
            city
            country
            zip
            default
          }
          orders(first: 5, sortKey: CREATED_AT, reverse: true) {
            edges {
              node {
                id
                name
                totalPriceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                displayFinancialStatus
                createdAt
              }
            }
          }
          metafields(first: 10) {
            edges {
              node {
                id
                namespace
                key
                value
              }
            }
          }
        }
      }
    `
    const gid = id.startsWith('gid://') ? id : `gid://shopify/Customer/${id}`

    const response = await client.query({
      data: {
        query,
        variables: { id: gid },
      },
    })

    return response.body.data.customer
  }

  /**
   * Create Customer
   */
  async createCustomer(shopDomain: string, input: any, userId?: number) {
    const store = await this.findStore(shopDomain, userId)
    const client = await this.shopifyClient.getGraphqlClient(store)

    const mutation = `
      mutation CustomerCreate($input: CustomerInput!) {
        customerCreate(input: $input) {
          customer {
            id
            firstName
            lastName
            email
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
        variables: { input },
      },
    })

    const { customerCreate } = response.body.data
    if (customerCreate.userErrors?.length) {
      throw new Error(`Customer create error: ${JSON.stringify(customerCreate.userErrors)}`)
    }
    return customerCreate.customer
  }

  /**
   * Update Customer
   */
  async updateCustomer(shopDomain: string, id: string, input: any, userId?: number) {
    const store = await this.findStore(shopDomain, userId)
    const client = await this.shopifyClient.getGraphqlClient(store)

    const mutation = `
      mutation CustomerUpdate($input: CustomerInput!) {
        customerUpdate(input: $input) {
          customer {
            id
            firstName
            lastName
            email
          }
          userErrors {
            field
            message
          }
        }
      }
    `
    const gid = id.startsWith('gid://') ? id : `gid://shopify/Customer/${id}`
    const updateInput = { ...input, id: gid }

    const response = await client.query({
      data: {
        query: mutation,
        variables: { input: updateInput },
      },
    })

    const { customerUpdate } = response.body.data
    if (customerUpdate.userErrors?.length) {
      throw new Error(`Customer update error: ${JSON.stringify(customerUpdate.userErrors)}`)
    }
    return customerUpdate.customer
  }

  /**
   * Delete Customer
   */
  async deleteCustomer(shopDomain: string, id: string, userId?: number) {
    const store = await this.findStore(shopDomain, userId)
    const client = await this.shopifyClient.getGraphqlClient(store)

    const mutation = `
      mutation CustomerDelete($id: ID!) {
        customerDelete(id: $id) {
          deletedCustomerId
          userErrors {
            field
            message
          }
        }
      }
    `
    const gid = id.startsWith('gid://') ? id : `gid://shopify/Customer/${id}`

    const response = await client.query({
      data: {
        query: mutation,
        variables: { id: gid },
      },
    })

    const { customerDelete } = response.body.data
    if (customerDelete.userErrors?.length) {
      throw new Error(`Customer delete error: ${JSON.stringify(customerDelete.userErrors)}`)
    }
    return customerDelete.deletedCustomerId
  }
}
