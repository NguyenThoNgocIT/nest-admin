import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import {
  BatchProductShippingClassDto,
  CreateProductShippingClassDto,
  UpdateProductShippingClassDto,
} from '../dto/product-shipping-class.dto'
import { WooCommerceProductShippingClassEntity } from '../entities/woocommerce-product-shipping-class.entity'
import { WooCommerceClientService } from '../services/woocommerce-client.service'

@Injectable()
export class ProductShippingClassService {
  private readonly logger = new Logger(ProductShippingClassService.name)

  constructor(
    @InjectRepository(WooCommerceProductShippingClassEntity)
    private readonly shippingClassRepository: Repository<WooCommerceProductShippingClassEntity>,
    private readonly wooCommerceClientService: WooCommerceClientService,
  ) {}

  async create(storeId: number, data: CreateProductShippingClassDto) {
    const client = await this.wooCommerceClientService.getClient(storeId)
    const response = await client.post('products/shipping_classes', data)
    await this.saveShippingClass(storeId, response.data)
    return response.data
  }

  async retrieve(storeId: number, shippingClassId: number) {
    const client = await this.wooCommerceClientService.getClient(storeId)
    const response = await client.get(`products/shipping_classes/${shippingClassId}`)
    await this.saveShippingClass(storeId, response.data)
    return response.data
  }

  async list(storeId: number, params: any = {}) {
    const client = await this.wooCommerceClientService.getClient(storeId)
    const response = await client.get('products/shipping_classes', params)

    if (Array.isArray(response.data)) {
      for (const item of response.data) {
        await this.saveShippingClass(storeId, item)
      }
    }

    return response.data
  }

  async update(
    storeId: number,
    shippingClassId: number,
    data: UpdateProductShippingClassDto,
  ) {
    const client = await this.wooCommerceClientService.getClient(storeId)
    const response = await client.put(`products/shipping_classes/${shippingClassId}`, data)
    await this.saveShippingClass(storeId, response.data)
    return response.data
  }

  async delete(storeId: number, shippingClassId: number, force = true) {
    const client = await this.wooCommerceClientService.getClient(storeId)
    const response = await client.delete(`products/shipping_classes/${shippingClassId}`, {
      force,
    })
    await this.shippingClassRepository.delete({ store_id: storeId, shipping_class_id: shippingClassId })
    return response.data
  }

  async batch(storeId: number, data: BatchProductShippingClassDto) {
    const client = await this.wooCommerceClientService.getClient(storeId)
    const response = await client.post('products/shipping_classes/batch', data)

    if (response.data.create) {
      for (const item of response.data.create) {
        await this.saveShippingClass(storeId, item)
      }
    }
    if (response.data.update) {
      for (const item of response.data.update) {
        await this.saveShippingClass(storeId, item)
      }
    }
    if (response.data.delete) {
      for (const item of response.data.delete) {
        await this.shippingClassRepository.delete({
          store_id: storeId,
          shipping_class_id: item.id,
        })
      }
    }

    return response.data
  }

  private async saveShippingClass(storeId: number, data: any) {
    const existing = await this.shippingClassRepository.findOne({
      where: { store_id: storeId, shipping_class_id: data.id },
    })

    const entity = existing || new WooCommerceProductShippingClassEntity()
    entity.store_id = storeId
    entity.shipping_class_id = data.id
    entity.name = data.name
    entity.slug = data.slug
    entity.description = data.description
    entity.count = data.count

    return this.shippingClassRepository.save(entity)
  }
}
