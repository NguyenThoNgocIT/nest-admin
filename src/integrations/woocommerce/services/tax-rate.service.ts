import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BatchTaxRateDto, CreateTaxRateDto, UpdateTaxRateDto } from '../dto/tax-rate.dto'
import { WooCommerceTaxRateEntity } from '../entities/woocommerce-tax-rate.entity'
import { WooCommerceClientService } from './woocommerce-client.service'

@Injectable()
export class TaxRateService {
  private readonly logger = new Logger(TaxRateService.name)

  constructor(
    private readonly clientService: WooCommerceClientService,
    @InjectRepository(WooCommerceTaxRateEntity)
    private readonly taxRateRepository: Repository<WooCommerceTaxRateEntity>,
  ) {}

  /**
   * Create a tax rate
   */
  async create(storeId: number, data: CreateTaxRateDto) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.post('taxes', data)
      await this.saveToDb(storeId, response.data)
      return response.data
    }
    catch (error) {
      this.logger.error(`Error creating tax rate: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * Retrieve a tax rate
   */
  async retrieve(storeId: number, id: number) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.get(`taxes/${id}`)
      await this.saveToDb(storeId, response.data)
      return response.data
    }
    catch (error) {
      this.logger.error(`Error retrieving tax rate: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * List all tax rates
   */
  async listAll(storeId: number, params?: any) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.get('taxes', params)

      // Batch save to DB
      for (const item of response.data) {
        await this.saveToDb(storeId, item)
      }

      return response.data
    }
    catch (error) {
      this.logger.error(`Error listing tax rates: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * Update a tax rate
   */
  async update(storeId: number, id: number, data: UpdateTaxRateDto) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.put(`taxes/${id}`, data)
      await this.saveToDb(storeId, response.data)
      return response.data
    }
    catch (error) {
      this.logger.error(`Error updating tax rate: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * Delete a tax rate
   */
  async delete(storeId: number, id: number, force = true) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.delete(`taxes/${id}`, { force })
      await this.taxRateRepository.delete({ id, store_id: storeId })
      return response.data
    }
    catch (error) {
      this.logger.error(`Error deleting tax rate: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * Batch update tax rates
   */
  async batch(storeId: number, data: BatchTaxRateDto) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.post('taxes/batch', data)

      if (response.data.create) {
        for (const item of response.data.create) {
          await this.saveToDb(storeId, item)
        }
      }
      if (response.data.update) {
        for (const item of response.data.update) {
          await this.saveToDb(storeId, item)
        }
      }
      if (response.data.delete) {
        for (const item of response.data.delete) {
          await this.taxRateRepository.delete({ id: item.id, store_id: storeId })
        }
      }

      return response.data
    }
    catch (error) {
      this.logger.error(`Error batch updating tax rates: ${error.message}`, error.stack)
      throw error
    }
  }

  private async saveToDb(storeId: number, data: any) {
    const entity = this.taxRateRepository.create({
      id: data.id,
      store_id: storeId,
      country: data.country,
      state: data.state,
      postcode: data.postcode,
      city: data.city,
      postcodes: data.postcodes,
      cities: data.cities,
      rate: data.rate,
      name: data.name,
      priority: data.priority,
      compound: data.compound,
      shipping: data.shipping,
      order: data.order,
      class: data.class,
    })
    return this.taxRateRepository.save(entity)
  }
}
