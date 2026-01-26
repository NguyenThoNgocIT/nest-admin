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
      query GetOrder($id: ID!) {
        order(id: $id) {
          id
          name
          createdAt
          displayFinancialStatus
          displayFulfillmentStatus
          currentTotalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          customer {
            id
            displayName
            defaultEmailAddress {
              emailAddress
            }
          }
          shippingAddress {
            name
            city
            country
          }
          lineItems(first: 50) {
            edges {
              node {
                id
                name
                quantity
                originalUnitPriceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                discountedTotalSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                variant {
                  id
                  sku
                  title
                }
              }
            }
          }
        }
      }
    `
    // Ensure GID
    const gid = orderId.startsWith('gid://') ? orderId : `gid://shopify/Order/${orderId}`

    const response = await client.query({
      data: {
        query,
        variables: { id: gid },
      },
    })

    return response.body.data.order
  }

  /**
   * Lấy danh sách Orders của 1 Customer cụ thể (dùng trong Customer details)
   */
  async listCustomerOrders(shopDomain: string, customerId: string, limit = 10, searchQuery?: string, userId?: number) {
    const store = await this.findStore(shopDomain, userId)
    const client = await this.shopifyClient.getGraphqlClient(store)

    const query = `
      query ListCustomerOrders($customerId: ID!, $first: Int!, $query: String) {
        customer(id: $customerId) {
          id
          displayName
          orders(first: $first, query: $query, sortKey: PROCESSED_AT) {
            edges {
              node {
                id
                name
                createdAt
                displayFinancialStatus
                currentTotalPriceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
              }
              cursor
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    `
    const gid = customerId.startsWith('gid://') ? customerId : `gid://shopify/Customer/${customerId}`

    const response = await client.query({
      data: {
        query,
        variables: {
          customerId: gid,
          first: limit,
          query: searchQuery || null,
        },
      },
    })

    return response.body.data.customer
  }

  /**
   * Data tổng quan Dashboard (Recent Orders + Count)
   */
  async listOrdersForDashboard(shopDomain: string, limit = 5, userId?: number) {
    const store = await this.findStore(shopDomain, userId)
    const client = await this.shopifyClient.getGraphqlClient(store)

    const query = `
      query ListOrdersForDashboard($first: Int!) {
        orders(first: $first, sortKey: CREATED_AT, reverse: true) {
          edges {
            node {
              id
              name
              createdAt
              currentTotalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              displayFinancialStatus
              displayFulfillmentStatus
            }
          }
        }
        ordersCount {
          count
        }
      }
    `

    const response = await client.query({
      data: {
        query,
        variables: { first: limit },
      },
    })

    return response.body.data
  }

  /**
   * Đóng đơn (Close Order)
   */
  async closeOrder(shopDomain: string, orderId: string, userId?: number) {
    const store = await this.findStore(shopDomain, userId)
    const client = await this.shopifyClient.getGraphqlClient(store)

    const mutation = `
      mutation CloseOrder($input: OrderCloseInput!) {
        orderClose(input: $input) {
          order {
            id
            name
            closedAt
            displayFinancialStatus
          }
          userErrors {
            field
            message
          }
        }
      }
    `
    // Ensure GID
    const gid = orderId.startsWith('gid://') ? orderId : `gid://shopify/Order/${orderId}`

    const response = await client.query({
      data: {
        query: mutation,
        variables: { input: { id: gid } },
      },
    })

    const { orderClose } = response.body.data
    if (orderClose.userErrors?.length) {
      throw new Error(`orderClose errors: ${JSON.stringify(orderClose.userErrors)}`)
    }

    return orderClose.order
  }

  /**
   * Mở lại đơn (Reopen Order)
   */
  async reopenOrder(shopDomain: string, orderId: string, userId?: number) {
    const store = await this.findStore(shopDomain, userId)
    const client = await this.shopifyClient.getGraphqlClient(store)

    const mutation = `
      mutation ReopenOrder($input: OrderOpenInput!) {
        orderOpen(input: $input) {
          order {
            id
            name
            closedAt
            displayFinancialStatus
          }
          userErrors {
            field
            message
          }
        }
      }
    `
    const gid = orderId.startsWith('gid://') ? orderId : `gid://shopify/Order/${orderId}`

    const response = await client.query({
      data: {
        query: mutation,
        variables: { input: { id: gid } },
      },
    })

    const { orderOpen } = response.body.data
    if (orderOpen.userErrors?.length) {
      throw new Error(`orderOpen errors: ${JSON.stringify(orderOpen.userErrors)}`)
    }

    return orderOpen.order
  }

  /**
   * Hủy đơn (Cancel Order)
   */
  async cancelOrder(shopDomain: string, orderId: string, reason = 'OTHER', userId?: number) {
    const store = await this.findStore(shopDomain, userId)
    const client = await this.shopifyClient.getGraphqlClient(store)

    const mutation = `
      mutation OrderCancel($orderId: ID!, $reason: OrderCancelReason!) {
        orderCancel(orderId: $orderId, reason: $reason) {
          job {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `
    const gid = orderId.startsWith('gid://') ? orderId : `gid://shopify/Order/${orderId}`

    const response = await client.query({
      data: {
        query: mutation,
        variables: { orderId: gid, reason },
      },
    })

    const { orderCancel } = response.body.data
    if (orderCancel.userErrors?.length) {
      throw new Error(`orderCancel errors: ${JSON.stringify(orderCancel.userErrors)}`)
    }
    return orderCancel.job
  }

  /**
   * Tạo Fulfillment V2
   */
  async fulfillOrder(
    shopDomain: string,
    lineItemsByFulfillmentOrder: any[],
    trackingInfo: any,
    userId?: number,
  ) {
    const store = await this.findStore(shopDomain, userId)
    const client = await this.shopifyClient.getGraphqlClient(store)

    const mutation = `
      mutation FulfillOrder($fulfillment: FulfillmentV2Input!) {
        fulfillmentCreateV2(fulfillment: $fulfillment) {
          fulfillment {
            id
            status
            displayStatus
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const input = {
      lineItemsByFulfillmentOrder,
      trackingInfo,
    }

    const response = await client.query({
      data: {
        query: mutation,
        variables: { fulfillment: input },
      },
    })

    const { fulfillmentCreateV2 } = response.body.data
    if (fulfillmentCreateV2.userErrors?.length) {
      throw new Error(
        `fulfillmentCreateV2 errors: ${JSON.stringify(fulfillmentCreateV2.userErrors)}`,
      )
    }

    return fulfillmentCreateV2.fulfillment
  }

  /**
   * Hoàn tiền (Refund)
   */
  async createRefund(
    shopDomain: string,
    orderId: string,
    refundLineItems: any[],
    transactions: any[],
    note: string,
    notify: boolean,
    userId?: number,
  ) {
    const store = await this.findStore(shopDomain, userId)
    const client = await this.shopifyClient.getGraphqlClient(store)

    const mutation = `
      mutation CreateRefund($input: RefundInput!) {
        refundCreate(input: $input) {
          refund {
            id
            createdAt
            note
            totalRefundedSet {
              shopMoney {
                amount
                currencyCode
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `
    const gid = orderId.startsWith('gid://') ? orderId : `gid://shopify/Order/${orderId}`

    const input = {
      orderId: gid,
      refundLineItems,
      transactions,
      note,
      notify,
    }

    const response = await client.query({
      data: {
        query: mutation,
        variables: { input },
      },
    })

    const { refundCreate } = response.body.data
    if (refundCreate.userErrors?.length) {
      throw new Error(`refundCreate errors: ${JSON.stringify(refundCreate.userErrors)}`)
    }

    return refundCreate.refund
  }
}
