import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BatchProductDto, CreateProductDto, UpdateProductDto } from '../dto/product.dto'
import { WooCommerceProductEntity } from '../entities/woocommerce-product.entity'
import { WooCommerceClientService } from './woocommerce-client.service'

@Injectable()
export class ProductService {
  constructor(
    private readonly clientService: WooCommerceClientService,
    @InjectRepository(WooCommerceProductEntity)
    private readonly productRepository: Repository<WooCommerceProductEntity>,
  ) {}

  async createProduct(storeId: number, data: CreateProductDto) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.post('products', data)
    await this.saveProductToDb(storeId, response.data)
    return response.data
  }

  async getCustomFieldNames(storeId: number) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.get('products/custom-fields/names')
    return response.data
  }

  async getProducts(storeId: number, params?: any) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.get('products', params)
    return response.data
  }

  async getProduct(storeId: number, productId: number) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.get(`products/${productId}`)
    return response.data
  }

  async updateProduct(storeId: number, productId: number, data: UpdateProductDto) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.put(`products/${productId}`, data)
    await this.saveProductToDb(storeId, response.data)
    return response.data
  }

  async deleteProduct(storeId: number, productId: number, force = false) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.delete(`products/${productId}`, { force })
    if (force) {
      await this.productRepository.delete({ storeId, wcId: productId })
    }
    return response.data
  }

  async batchUpdateProducts(storeId: number, data: BatchProductDto) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.post('products/batch', data)

    // Sync created and updated products
    if (response.data.create) {
      for (const p of response.data.create) await this.saveProductToDb(storeId, p)
    }
    if (response.data.update) {
      for (const p of response.data.update) await this.saveProductToDb(storeId, p)
    }
    if (response.data.delete) {
      for (const p of response.data.delete) {
        // delete response might be object or id depending on API, doc says response object
        const id = p.id || p
        await this.productRepository.delete({ storeId, wcId: id })
      }
    }
    return response.data
  }

  async duplicateProduct(storeId: number, productId: number) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.post(`products/${productId}/duplicate`)
    await this.saveProductToDb(storeId, response.data)
    return response.data
  }

  async saveProductToDb(storeId: number, p: any) {
    let entity = await this.productRepository.findOne({ where: { storeId, wcId: p.id } })
    if (!entity) {
      entity = new WooCommerceProductEntity()
      entity.storeId = storeId
      entity.wcId = p.id
    }

    entity.name = p.name
    entity.slug = p.slug
    entity.permalink = p.permalink
    entity.date_created = p.date_created ? new Date(p.date_created) : null
    entity.date_modified = p.date_modified ? new Date(p.date_modified) : null
    entity.type = p.type
    entity.status = p.status
    entity.featured = p.featured
    entity.catalog_visibility = p.catalog_visibility
    entity.description = p.description
    entity.short_description = p.short_description
    entity.sku = p.sku
    entity.price = p.price
    entity.regular_price = p.regular_price
    entity.sale_price = p.sale_price
    entity.on_sale = p.on_sale
    entity.purchasable = p.purchasable
    entity.total_sales = p.total_sales
    entity.virtual = p.virtual
    entity.downloadable = p.downloadable
    entity.tax_status = p.tax_status
    entity.tax_class = p.tax_class
    entity.manage_stock = p.manage_stock
    entity.stock_quantity = p.stock_quantity
    entity.stock_status = p.stock_status
    entity.backorders = p.backorders
    entity.weight = p.weight
    entity.dimensions = p.dimensions
    entity.reviews_allowed = p.reviews_allowed
    entity.average_rating = p.average_rating
    entity.rating_count = p.rating_count
    entity.related_ids = p.related_ids
    entity.upsell_ids = p.upsell_ids
    entity.cross_sell_ids = p.cross_sell_ids
    entity.parent_id = p.parent_id
    entity.categories = p.categories
    entity.tags = p.tags
    entity.images = p.images
    entity.attributes = p.attributes
    entity.default_attributes = p.default_attributes
    entity.variations = p.variations
    entity.grouped_products = p.grouped_products
    entity.menu_order = p.menu_order
    entity.meta_data = p.meta_data

    return this.productRepository.save(entity)
  }

  async syncProducts(storeId: number) {
    const products = await this.getProducts(storeId, { per_page: 100 })
    const savedProducts = []

    for (const p of products) {
      savedProducts.push(await this.saveProductToDb(storeId, p))
    }
    return savedProducts
  }
}
