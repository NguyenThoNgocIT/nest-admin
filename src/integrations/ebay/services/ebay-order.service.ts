// src/integrations/ebay/services/ebay-order.service.ts

import { Injectable } from '@nestjs/common'
import { EbayStoreEntity } from '../entities/ebay-store.entity'
import { EbayClientService } from './ebay-client.service'

@Injectable()
export class EbayOrderService {
  constructor(private readonly clientService: EbayClientService) {}

  /**
   * 📦 Fetch orders from eBay
   */
  async fetchOrders(store: EbayStoreEntity, since?: Date) {
    const client = await this.clientService.getClient(store)

    const params: any = {
      limit: 50,
    }

    // Filter by lastmodifieddate if provided
    // Format ISO string for eBay API: yyyy-MM-ddThh:mm:ss.SSSZ
    if (since) {
      params.filter = `lastmodifieddate:[${since.toISOString()}..]`
    }

    // API: https://api.ebay.com/sell/fulfillment/v1/order
    const response = await client.get('/sell/fulfillment/v1/order', { params })

    return response.data.orders || []
  }

  /**
   * 🔄 Map eBay order to unified format (Example)
   */
  mapToUnifiedOrder(ebayOrder: any) {
    return {
      platform: 'EBAY',
      externalId: ebayOrder.orderId,
      total: ebayOrder.pricingSummary.total.value,
      currency: ebayOrder.pricingSummary.total.currency,
      buyerEmail: ebayOrder.buyer.email, // Lưu ý: Email này thường là alias của eBay
      createdAt: ebayOrder.creationDate,
      items: (ebayOrder.lineItems || []).map((item: any) => ({
        externalId: item.lineItemId,
        sku: item.sku,
        quantity: item.quantity,
        price: item.lineItemCost.value,
        title: item.title,
      })),
    }
  }
}
