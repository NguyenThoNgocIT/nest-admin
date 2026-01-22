import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import {
  BatchProductTagDto,
  CreateProductTagDto,
  UpdateProductTagDto,
} from '../dto/product-tag.dto'
import { WooCommerceProductTagEntity } from '../entities/woocommerce-product-tag.entity'
import { WooCommerceClientService } from '../services/woocommerce-client.service'

@Injectable()
export class ProductTagService {
  private readonly logger = new Logger(ProductTagService.name)

  constructor(
    @InjectRepository(WooCommerceProductTagEntity)
    private readonly tagRepository: Repository<WooCommerceProductTagEntity>,
    private readonly wooCommerceClientService: WooCommerceClientService,
  ) {}

  async create(storeId: number, data: CreateProductTagDto) {
    const client = await this.wooCommerceClientService.getClient(storeId)
    const response = await client.post('products/tags', data)
    await this.saveTag(storeId, response.data)
    return response.data
  }

  async retrieve(storeId: number, tagId: number) {
    const client = await this.wooCommerceClientService.getClient(storeId)
    const response = await client.get(`products/tags/${tagId}`)
    await this.saveTag(storeId, response.data)
    return response.data
  }

  async list(storeId: number, params: any = {}) {
    const client = await this.wooCommerceClientService.getClient(storeId)
    const response = await client.get('products/tags', params)

    if (Array.isArray(response.data)) {
      for (const tag of response.data) {
        await this.saveTag(storeId, tag)
      }
    }

    return response.data
  }

  async update(
    storeId: number,
    tagId: number,
    data: UpdateProductTagDto,
  ) {
    const client = await this.wooCommerceClientService.getClient(storeId)
    const response = await client.put(`products/tags/${tagId}`, data)
    await this.saveTag(storeId, response.data)
    return response.data
  }

  async delete(storeId: number, tagId: number, force = true) {
    const client = await this.wooCommerceClientService.getClient(storeId)
    const response = await client.delete(`products/tags/${tagId}`, {
      force,
    })
    await this.tagRepository.delete({ store_id: storeId, tag_id: tagId })
    return response.data
  }

  async batch(storeId: number, data: BatchProductTagDto) {
    const client = await this.wooCommerceClientService.getClient(storeId)
    const response = await client.post('products/tags/batch', data)

    if (response.data.create) {
      for (const tag of response.data.create) {
        await this.saveTag(storeId, tag)
      }
    }
    if (response.data.update) {
      for (const tag of response.data.update) {
        await this.saveTag(storeId, tag)
      }
    }
    if (response.data.delete) {
      for (const tag of response.data.delete) {
        await this.tagRepository.delete({
          store_id: storeId,
          tag_id: tag.id,
        })
      }
    }

    return response.data
  }

  private async saveTag(storeId: number, tagData: any) {
    const existing = await this.tagRepository.findOne({
      where: { store_id: storeId, tag_id: tagData.id },
    })

    const entity = existing || new WooCommerceProductTagEntity()
    entity.store_id = storeId
    entity.tag_id = tagData.id
    entity.name = tagData.name
    entity.slug = tagData.slug
    entity.description = tagData.description
    entity.count = tagData.count

    return this.tagRepository.save(entity)
  }
}
