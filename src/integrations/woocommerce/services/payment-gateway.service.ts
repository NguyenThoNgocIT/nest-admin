import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UpdatePaymentGatewayDto } from '../dto/payment-gateway.dto'
import { WooCommercePaymentGatewayEntity } from '../entities/woocommerce-payment-gateway.entity'
import { WooCommerceClientService } from './woocommerce-client.service'

@Injectable()
export class PaymentGatewayService {
  private readonly logger = new Logger(PaymentGatewayService.name)

  constructor(
    private readonly clientService: WooCommerceClientService,
    @InjectRepository(WooCommercePaymentGatewayEntity)
    private readonly paymentGatewayRepository: Repository<WooCommercePaymentGatewayEntity>,
  ) {}

  /**
   * List all payment gateways
   */
  async listAll(storeId: number) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.get('payment_gateways')

      // Sync to DB
      for (const gateway of response.data) {
        await this.saveToDb(storeId, gateway)
      }

      return response.data
    }
    catch (error) {
      this.logger.error(`Error listing payment gateways: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * Retrieve a payment gateway
   */
  async retrieve(storeId: number, id: string) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.get(`payment_gateways/${id}`)
      await this.saveToDb(storeId, response.data)
      return response.data
    }
    catch (error) {
      this.logger.error(`Error retrieving payment gateway: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * Update a payment gateway
   */
  async update(storeId: number, id: string, data: UpdatePaymentGatewayDto) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.put(`payment_gateways/${id}`, data)
      await this.saveToDb(storeId, response.data)
      return response.data
    }
    catch (error) {
      this.logger.error(`Error updating payment gateway: ${error.message}`, error.stack)
      throw error
    }
  }

  private async saveToDb(storeId: number, data: any) {
    const entity = this.paymentGatewayRepository.create({
      id: data.id,
      store_id: storeId,
      title: data.title,
      description: data.description,
      order: data.order,
      enabled: data.enabled,
      method_title: data.method_title,
      method_description: data.method_description,
      method_supports: data.method_supports,
      settings: data.settings,
    })
    return this.paymentGatewayRepository.save(entity)
  }
}
