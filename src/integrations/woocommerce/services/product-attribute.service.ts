import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BatchProductAttributeDto, CreateProductAttributeDto, UpdateProductAttributeDto } from '../dto/product-attribute.dto'
import { WooCommerceProductAttributeEntity } from '../entities/woocommerce-product-attribute.entity'
import { WooCommerceClientService } from './woocommerce-client.service'

@Injectable()
export class ProductAttributeService {
  constructor(
    private readonly clientService: WooCommerceClientService,
    @InjectRepository(WooCommerceProductAttributeEntity)
    private readonly attributeRepository: Repository<WooCommerceProductAttributeEntity>,
  ) {}

  async createAttribute(storeId: number, data: CreateProductAttributeDto) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.post('products/attributes', data)
    await this.saveAttributeToDb(storeId, response.data)
    return response.data
  }

  async getAttributes(storeId: number, params?: any) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.get('products/attributes', params)
    return response.data
  }

  async getAttribute(storeId: number, attributeId: number) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.get(`products/attributes/${attributeId}`)
    return response.data
  }

  async updateAttribute(storeId: number, attributeId: number, data: UpdateProductAttributeDto) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.put(`products/attributes/${attributeId}`, data)
    await this.saveAttributeToDb(storeId, response.data)
    return response.data
  }

  async deleteAttribute(storeId: number, attributeId: number, force = true) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.delete(`products/attributes/${attributeId}`, { force })
    if (force) {
      await this.attributeRepository.delete({ store_id: storeId, attribute_id: attributeId })
    }
    return response.data
  }

  async batchUpdateAttributes(storeId: number, data: BatchProductAttributeDto) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.post('products/attributes/batch', data)

    if (response.data.create) {
      for (const a of response.data.create) await this.saveAttributeToDb(storeId, a)
    }
    if (response.data.update) {
      for (const a of response.data.update) await this.saveAttributeToDb(storeId, a)
    }
    if (response.data.delete) {
      for (const a of response.data.delete) {
        const id = a.id || a
        await this.attributeRepository.delete({ store_id: storeId, attribute_id: id })
      }
    }
    return response.data
  }

  async saveAttributeToDb(storeId: number, a: any) {
    let entity = await this.attributeRepository.findOne({ where: { store_id: storeId, attribute_id: a.id } })
    if (!entity) {
      entity = new WooCommerceProductAttributeEntity()
      entity.store_id = storeId
      entity.attribute_id = a.id
    }

    entity.name = a.name
    entity.slug = a.slug
    entity.type = a.type
    entity.order_by = a.order_by
    entity.has_archives = a.has_archives

    return this.attributeRepository.save(entity)
  }

  async syncAttributes(storeId: number) {
    const attributes = await this.getAttributes(storeId, { per_page: 100 })
    const saved = []
    for (const a of attributes) {
      saved.push(await this.saveAttributeToDb(storeId, a))
    }
    return saved
  }
}
