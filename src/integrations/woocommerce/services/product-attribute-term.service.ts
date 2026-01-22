import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import {
  BatchProductAttributeTermDto,
  CreateProductAttributeTermDto,
  UpdateProductAttributeTermDto,
} from '../dto/product-attribute-term.dto'
import { WooCommerceProductAttributeTermEntity } from '../entities/woocommerce-product-attribute-term.entity'
import { WooCommerceClientService } from '../services/woocommerce-client.service'

@Injectable()
export class ProductAttributeTermService {
  private readonly logger = new Logger(ProductAttributeTermService.name)

  constructor(
    @InjectRepository(WooCommerceProductAttributeTermEntity)
    private readonly termRepository: Repository<WooCommerceProductAttributeTermEntity>,
    private readonly wooCommerceClientService: WooCommerceClientService,
  ) {}

  async create(storeId: number, attributeId: number, data: CreateProductAttributeTermDto) {
    const client = await this.wooCommerceClientService.getClient(storeId)
    const response = await client.post(`products/attributes/${attributeId}/terms`, data)
    await this.saveTerm(storeId, attributeId, response.data)
    return response.data
  }

  async retrieve(storeId: number, attributeId: number, termId: number) {
    const client = await this.wooCommerceClientService.getClient(storeId)
    const response = await client.get(`products/attributes/${attributeId}/terms/${termId}`)
    await this.saveTerm(storeId, attributeId, response.data)
    return response.data
  }

  async list(storeId: number, attributeId: number, params: any = {}) {
    const client = await this.wooCommerceClientService.getClient(storeId)
    const response = await client.get(`products/attributes/${attributeId}/terms`, params)

    if (Array.isArray(response.data)) {
      for (const term of response.data) {
        await this.saveTerm(storeId, attributeId, term)
      }
    }

    return response.data
  }

  async update(
    storeId: number,
    attributeId: number,
    termId: number,
    data: UpdateProductAttributeTermDto,
  ) {
    const client = await this.wooCommerceClientService.getClient(storeId)
    const response = await client.put(`products/attributes/${attributeId}/terms/${termId}`, data)
    await this.saveTerm(storeId, attributeId, response.data)
    return response.data
  }

  async delete(storeId: number, attributeId: number, termId: number, force = true) {
    const client = await this.wooCommerceClientService.getClient(storeId)
    const response = await client.delete(`products/attributes/${attributeId}/terms/${termId}`, {
      force,
    })
    await this.termRepository.delete({ store_id: storeId, attribute_id: attributeId, term_id: termId })
    return response.data
  }

  async batch(storeId: number, attributeId: number, data: BatchProductAttributeTermDto) {
    const client = await this.wooCommerceClientService.getClient(storeId)
    const response = await client.post(`products/attributes/${attributeId}/terms/batch`, data)

    if (response.data.create) {
      for (const term of response.data.create) {
        await this.saveTerm(storeId, attributeId, term)
      }
    }
    if (response.data.update) {
      for (const term of response.data.update) {
        await this.saveTerm(storeId, attributeId, term)
      }
    }
    if (response.data.delete) {
      for (const term of response.data.delete) {
        await this.termRepository.delete({
          store_id: storeId,
          attribute_id: attributeId,
          term_id: term.id,
        })
      }
    }

    return response.data
  }

  private async saveTerm(storeId: number, attributeId: number, termData: any) {
    const existing = await this.termRepository.findOne({
      where: { store_id: storeId, attribute_id: attributeId, term_id: termData.id },
    })

    const entity = existing || new WooCommerceProductAttributeTermEntity()
    entity.store_id = storeId
    entity.attribute_id = attributeId
    entity.term_id = termData.id
    entity.name = termData.name
    entity.slug = termData.slug
    entity.description = termData.description
    entity.menu_order = termData.menu_order
    entity.count = termData.count

    return this.termRepository.save(entity)
  }
}
