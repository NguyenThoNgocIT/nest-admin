import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateOrderDto, UpdateOrderDto } from '../dto/create-order.dto'
import { SyncOrderDto } from '../dto/sync-order.dto'
import { WooCommerceOrderEntity } from '../entities/woocommerce-order.entity'
import { WooCommerceClientService } from './woocommerce-client.service'

@Injectable()
export class OrderService {
  constructor(
    private readonly clientService: WooCommerceClientService,
    @InjectRepository(WooCommerceOrderEntity)
    private readonly orderRepository: Repository<WooCommerceOrderEntity>,
  ) {}

  async createOrder(storeId: number, data: CreateOrderDto) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.post('orders', data)
    return response.data
  }

  async getOrders(storeId: number, params: SyncOrderDto) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.get('orders', params)
    return response.data
  }

  async getOrder(storeId: number, orderId: number) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.get(`orders/${orderId}`)
    return response.data
  }

  async updateOrder(storeId: number, orderId: number, data: UpdateOrderDto) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.put(`orders/${orderId}`, data)
    return response.data
  }

  async deleteOrder(storeId: number, orderId: number, force = false) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.delete(`orders/${orderId}`, { force })
    return response.data
  }

  async syncOrders(storeId: number) {
    const orders = await this.getOrders(storeId, { per_page: 100 })
    const savedOrders = []

    for (const o of orders) {
      let entity = await this.orderRepository.findOne({ where: { storeId, wcId: o.id } })
      if (!entity) {
        entity = new WooCommerceOrderEntity()
        entity.storeId = storeId
        entity.wcId = o.id
      }

      entity.number = o.number
      entity.orderKey = o.order_key
      entity.status = o.status
      entity.currency = o.currency
      entity.dateCreated = o.date_created ? new Date(o.date_created) : null
      entity.dateModified = o.date_modified ? new Date(o.date_modified) : null
      entity.discountTotal = Number.parseFloat(o.discount_total || '0')
      entity.discountTax = Number.parseFloat(o.discount_tax || '0')
      entity.shippingTotal = Number.parseFloat(o.shipping_total || '0')
      entity.shippingTax = Number.parseFloat(o.shipping_tax || '0')
      entity.cartTax = Number.parseFloat(o.cart_tax || '0')
      entity.total = Number.parseFloat(o.total || '0')
      entity.totalTax = Number.parseFloat(o.total_tax || '0')
      entity.pricesIncludeTax = o.prices_include_tax
      entity.customerId = o.customer_id
      entity.customerIpAddress = o.customer_ip_address
      entity.customerUserAgent = o.customer_user_agent
      entity.customerNote = o.customer_note
      entity.billing = o.billing
      entity.shipping = o.shipping
      entity.paymentMethod = o.payment_method
      entity.paymentMethodTitle = o.payment_method_title
      entity.transactionId = o.transaction_id
      entity.datePaid = o.date_paid ? new Date(o.date_paid) : null
      entity.dateCompleted = o.date_completed ? new Date(o.date_completed) : null
      entity.cartHash = o.cart_hash
      entity.lineItems = o.line_items
      entity.taxLines = o.tax_lines
      entity.shippingLines = o.shipping_lines
      entity.feeLines = o.fee_lines
      entity.couponLines = o.coupon_lines
      entity.refunds = o.refunds
      entity.metaData = o.meta_data
      entity.rawData = o

      savedOrders.push(await this.orderRepository.save(entity))
    }
    return savedOrders
  }
}
