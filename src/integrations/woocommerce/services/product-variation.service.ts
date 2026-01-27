import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BatchProductVariationDto, CreateProductVariationDto, UpdateProductVariationDto } from '../dto/product-variation.dto'
import { WooCommerceProductVariationEntity } from '../entities/woocommerce-product-variation.entity'
import { WooCommerceClientService } from './woocommerce-client.service'

@Injectable()
export class ProductVariationService {
  constructor(
    private readonly clientService: WooCommerceClientService,
    @InjectRepository(WooCommerceProductVariationEntity)
    private readonly variationRepository: Repository<WooCommerceProductVariationEntity>,
  ) {}

  async createVariation(storeId: number, productId: number, data: CreateProductVariationDto) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.post(`products/${productId}/variations`, data)
    await this.saveVariationToDb(storeId, productId, response.data)
    return response.data
  }

  async getVariations(storeId: number, productId: number, params?: any) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.get(`products/${productId}/variations`, params)
    return response.data
  }

  async getVariation(storeId: number, productId: number, variationId: number) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.get(`products/${productId}/variations/${variationId}`)
    return response.data
  }

  async updateVariation(storeId: number, productId: number, variationId: number, data: UpdateProductVariationDto) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.put(`products/${productId}/variations/${variationId}`, data)
    await this.saveVariationToDb(storeId, productId, response.data)
    return response.data
  }

  async deleteVariation(storeId: number, productId: number, variationId: number, force = true) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.delete(`products/${productId}/variations/${variationId}`, { force })
    if (force) {
      await this.variationRepository.delete({ store_id: storeId, variation_id: variationId })
    }
    return response.data
  }

  async batchUpdateVariations(storeId: number, productId: number, data: BatchProductVariationDto) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.post(`products/${productId}/variations/batch`, data)

    if (response.data.create) {
      for (const v of response.data.create) await this.saveVariationToDb(storeId, productId, v)
    }
    if (response.data.update) {
      for (const v of response.data.update) await this.saveVariationToDb(storeId, productId, v)
    }
    if (response.data.delete) {
      for (const v of response.data.delete) {
        const id = v.id || v
        await this.variationRepository.delete({ store_id: storeId, variation_id: id })
      }
    }
    return response.data
  }

  async saveVariationToDb(storeId: number, productId: number, v: any) {
    let entity = await this.variationRepository.findOne({ where: { store_id: storeId, variation_id: v.id } })
    if (!entity) {
      entity = new WooCommerceProductVariationEntity()
      entity.store_id = storeId
      entity.product_id = productId
      entity.variation_id = v.id
    }

    entity.date_created = v.date_created ? new Date(v.date_created) : null
    entity.date_modified = v.date_modified ? new Date(v.date_modified) : null
    entity.description = v.description
    entity.permalink = v.permalink
    entity.sku = v.sku
    entity.price = v.price
    entity.regular_price = v.regular_price
    entity.sale_price = v.sale_price
    entity.date_on_sale_from = v.date_on_sale_from ? new Date(v.date_on_sale_from) : null
    entity.date_on_sale_to = v.date_on_sale_to ? new Date(v.date_on_sale_to) : null
    entity.on_sale = v.on_sale
    entity.status = v.status
    entity.purchasable = v.purchasable
    entity.virtual = v.virtual
    entity.downloadable = v.downloadable
    entity.downloads = v.downloads
    entity.download_limit = v.download_limit
    entity.download_expiry = v.download_expiry
    entity.tax_status = v.tax_status
    entity.tax_class = v.tax_class
    entity.manage_stock = v.manage_stock === 'parent' ? false : v.manage_stock // normalize
    entity.stock_quantity = v.stock_quantity
    entity.stock_status = v.stock_status
    entity.backorders = v.backorders
    entity.backorders_allowed = v.backorders_allowed
    entity.backordered = v.backordered
    entity.weight = v.weight
    entity.dimensions = v.dimensions
    entity.shipping_class = v.shipping_class
    entity.shipping_class_id = v.shipping_class_id
    entity.image = v.image
    entity.attributes = v.attributes
    entity.menu_order = v.menu_order
    entity.meta_data = v.meta_data

    return this.variationRepository.save(entity)
  }

  async syncVariations(storeId: number, productId: number) {
    const variations = await this.getVariations(storeId, productId, { per_page: 100 })
    const saved = []
    for (const v of variations) {
      saved.push(await this.saveVariationToDb(storeId, productId, v))
    }
    return saved
  }
}
