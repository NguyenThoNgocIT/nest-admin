import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateOrderRefundDto } from '../dto/order-refund.dto'
import { WooCommerceOrderRefundEntity } from '../entities/woocommerce-order-refund.entity'
import { WooCommerceClientService } from './woocommerce-client.service'

@Injectable()
export class OrderRefundService {
  constructor(
    private readonly clientService: WooCommerceClientService,
    @InjectRepository(WooCommerceOrderRefundEntity)
    private readonly refundRepository: Repository<WooCommerceOrderRefundEntity>,
  ) {}

  async createRefund(storeId: number, orderId: number, data: CreateOrderRefundDto) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.post(`orders/${orderId}/refunds`, data)

    // Optional: save to DB immediately
    await this.saveRefundToDb(storeId, orderId, response.data)

    return response.data
  }

  async getRefund(storeId: number, orderId: number, refundId: number) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.get(`orders/${orderId}/refunds/${refundId}`)
    return response.data
  }

  async getRefunds(storeId: number, orderId: number, params?: any) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.get(`orders/${orderId}/refunds`, params)
    return response.data
  }

  async findAllRefunds(storeId: number, params?: any) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.get('refunds', params)
    return response.data
  }

  async deleteRefund(storeId: number, orderId: number, refundId: number) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.delete(`orders/${orderId}/refunds/${refundId}`, { force: true })

    // Remove from DB if exists
    await this.refundRepository.delete({ id: refundId, store_id: storeId })

    return response.data
  }

  // Helper to sync from API response to local DB
  async saveRefundToDb(storeId: number, orderId: number, refundData: any) {
    const entity = this.refundRepository.create({
      id: refundData.id,
      store_id: storeId,
      order_id: orderId,
      date_created: new Date(refundData.date_created),
      date_created_gmt: refundData.date_created_gmt ? new Date(refundData.date_created_gmt) : null,
      amount: refundData.amount,
      reason: refundData.reason,
      refunded_by: refundData.refunded_by,
      refunded_payment: refundData.refunded_payment,
      meta_data: refundData.meta_data,
      line_items: refundData.line_items,
      tax_lines: refundData.tax_lines,
      shipping_lines: refundData.shipping_lines,
      fee_lines: refundData.fee_lines,
    })

    return this.refundRepository.save(entity)
  }

  async syncRefunds(storeId: number, orderId: number) {
    const refunds = await this.getRefunds(storeId, orderId)
    const savedRefunds = []
    for (const refund of refunds) {
      savedRefunds.push(await this.saveRefundToDb(storeId, orderId, refund))
    }
    return savedRefunds
  }
}
