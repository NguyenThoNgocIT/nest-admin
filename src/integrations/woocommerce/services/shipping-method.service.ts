import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { WooCommerceShippingMethodEntity } from '../entities/woocommerce-shipping-method.entity'
import { WooCommerceClientService } from './woocommerce-client.service'

@Injectable()
export class ShippingMethodService {
  private readonly logger = new Logger(ShippingMethodService.name)

  constructor(
    private readonly clientService: WooCommerceClientService,
    @InjectRepository(WooCommerceShippingMethodEntity)
    private readonly shippingMethodRepository: Repository<WooCommerceShippingMethodEntity>,
  ) {}

  /**
   * List all shipping methods
   */
  async listAll(storeId: number) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.get('shipping_methods')

      // Sync with DB
      for (const method of response.data) {
        await this.saveToDb(storeId, method)
      }

      return response.data
    }
    catch (error) {
      this.logger.error(`Error listing shipping methods: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * Retrieve a shipping method
   */
  async retrieve(storeId: number, methodId: string) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.get(`shipping_methods/${methodId}`)

      await this.saveToDb(storeId, response.data)

      return response.data
    }
    catch (error) {
      this.logger.error(`Error retrieving shipping method ${methodId}: ${error.message}`, error.stack)
      throw error
    }
  }

  private async saveToDb(storeId: number, data: any) {
    let entity = await this.shippingMethodRepository.findOne({
      where: { store_id: storeId, method_id: data.id },
    })

    if (!entity) {
      entity = this.shippingMethodRepository.create({
        store_id: storeId,
        method_id: data.id,
      })
    }

    entity.title = data.title
    entity.description = data.description

    return this.shippingMethodRepository.save(entity)
  }
}
