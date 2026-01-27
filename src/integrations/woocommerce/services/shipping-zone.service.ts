import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ShippingZoneLocationDto } from '../dto/shipping-zone-location.dto'
import { CreateShippingZoneDto, UpdateShippingZoneDto } from '../dto/shipping-zone.dto'
import { WooCommerceShippingZoneLocationEntity } from '../entities/woocommerce-shipping-zone-location.entity'
import { WooCommerceShippingZoneEntity } from '../entities/woocommerce-shipping-zone.entity'
import { WooCommerceClientService } from './woocommerce-client.service'

@Injectable()
export class ShippingZoneService {
  private readonly logger = new Logger(ShippingZoneService.name)

  constructor(
    private readonly clientService: WooCommerceClientService,
    @InjectRepository(WooCommerceShippingZoneEntity)
    private readonly shippingZoneRepository: Repository<WooCommerceShippingZoneEntity>,
    @InjectRepository(WooCommerceShippingZoneLocationEntity)
    private readonly locationRepository: Repository<WooCommerceShippingZoneLocationEntity>,
  ) {}

  /**
   * Create a shipping zone
   */
  async create(storeId: number, data: CreateShippingZoneDto) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.post('shipping/zones', data)
      await this.saveToDb(storeId, response.data)
      return response.data
    }
    catch (error) {
      this.logger.error(`Error creating shipping zone: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * Retrieve a shipping zone
   */
  async retrieve(storeId: number, id: number) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.get(`shipping/zones/${id}`)
      await this.saveToDb(storeId, response.data)
      return response.data
    }
    catch (error) {
      this.logger.error(`Error retrieving shipping zone: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * List all shipping zones
   */
  async listAll(storeId: number) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.get('shipping/zones')

      // Sync to DB
      for (const zone of response.data) {
        await this.saveToDb(storeId, zone)
      }

      return response.data
    }
    catch (error) {
      this.logger.error(`Error listing shipping zones: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * Update a shipping zone
   */
  async update(storeId: number, id: number, data: UpdateShippingZoneDto) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.put(`shipping/zones/${id}`, data)
      await this.saveToDb(storeId, response.data)
      return response.data
    }
    catch (error) {
      this.logger.error(`Error updating shipping zone: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * Delete a shipping zone
   */
  async delete(storeId: number, id: number) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.delete(`shipping/zones/${id}`, { force: true })
      await this.shippingZoneRepository.delete({ id, store_id: storeId })
      return response.data
    }
    catch (error) {
      this.logger.error(`Error deleting shipping zone: ${error.message}`, error.stack)
      throw error
    }
  }

  private async saveToDb(storeId: number, data: any) {
    const entity = this.shippingZoneRepository.create({
      id: data.id,
      store_id: storeId,
      name: data.name,
      order: data.order,
    })
    return this.shippingZoneRepository.save(entity)
  }

  /**
   * List all locations of a shipping zone
   */
  async listLocations(storeId: number, zoneId: number) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.get(`shipping/zones/${zoneId}/locations`)

      // Update local cache
      // We overwrite locations for this zone
      await this.locationRepository.delete({ store_id: storeId, zone_id: zoneId })

      for (const loc of response.data) {
        await this.saveLocationToDb(storeId, zoneId, loc)
      }

      return response.data
    }
    catch (error) {
      this.logger.error(`Error listing shipping zone locations: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * Update locations of a shipping zone
   */
  async updateLocations(storeId: number, zoneId: number, data: ShippingZoneLocationDto[]) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.put(`shipping/zones/${zoneId}/locations`, data)

      // Update local cache
      await this.locationRepository.delete({ store_id: storeId, zone_id: zoneId })

      for (const loc of response.data) {
        await this.saveLocationToDb(storeId, zoneId, loc)
      }
      return response.data
    }
    catch (error) {
      this.logger.error(`Error updating shipping zone locations: ${error.message}`, error.stack)
      throw error
    }
  }

  private async saveLocationToDb(storeId: number, zoneId: number, data: any) {
    const entity = this.locationRepository.create({
      store_id: storeId,
      zone_id: zoneId,
      code: data.code,
      type: data.type,
    })
    return this.locationRepository.save(entity)
  }
}
