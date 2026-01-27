import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateTaxClassDto, TaxClassDto } from '../dto/tax-class.dto'
import { WooCommerceTaxClassEntity } from '../entities/woocommerce-tax-class.entity'
import { WooCommerceClientService } from './woocommerce-client.service'

@Injectable()
export class TaxClassService {
  private readonly logger = new Logger(TaxClassService.name)

  constructor(
    private readonly clientService: WooCommerceClientService,
    @InjectRepository(WooCommerceTaxClassEntity)
    private readonly taxClassRepository: Repository<WooCommerceTaxClassEntity>,
  ) {}

  /**
   * Create a tax class
   */
  async create(storeId: number, data: CreateTaxClassDto): Promise<TaxClassDto> {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.post('taxes/classes', data)
      await this.saveToDb(storeId, response.data)
      return response.data
    }
    catch (error) {
      this.logger.error(`Error creating tax class: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * List all tax classes
   */
  async listAll(storeId: number): Promise<TaxClassDto[]> {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.get('taxes/classes')

      // Batch save to DB
      for (const item of response.data) {
        await this.saveToDb(storeId, item)
      }

      return response.data
    }
    catch (error) {
      this.logger.error(`Error listing tax classes: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * Delete a tax class
   */
  async delete(storeId: number, slug: string) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.delete(`taxes/classes/${slug}`, { force: true })
      await this.taxClassRepository.delete({ slug, store_id: storeId })
      return response.data
    }
    catch (error) {
      this.logger.error(`Error deleting tax class: ${error.message}`, error.stack)
      throw error
    }
  }

  private async saveToDb(storeId: number, data: any) {
    const entity = this.taxClassRepository.create({
      store_id: storeId,
      slug: data.slug,
      name: data.name,
    })
    return this.taxClassRepository.save(entity)
  }
}
