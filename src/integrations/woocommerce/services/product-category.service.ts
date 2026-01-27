import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import {
  BatchProductCategoryDto,
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
} from '../dto/product-category.dto'
import { WooCommerceProductCategoryEntity } from '../entities/woocommerce-product-category.entity'
import { WooCommerceClientService } from '../services/woocommerce-client.service'

@Injectable()
export class ProductCategoryService {
  private readonly logger = new Logger(ProductCategoryService.name)

  constructor(
    @InjectRepository(WooCommerceProductCategoryEntity)
    private readonly categoryRepository: Repository<WooCommerceProductCategoryEntity>,
    private readonly wooCommerceClientService: WooCommerceClientService,
  ) {}

  async create(storeId: number, data: CreateProductCategoryDto) {
    const client = await this.wooCommerceClientService.getClient(storeId)
    const response = await client.post('products/categories', data)
    await this.saveCategory(storeId, response.data)
    return response.data
  }

  async retrieve(storeId: number, categoryId: number) {
    const client = await this.wooCommerceClientService.getClient(storeId)
    const response = await client.get(`products/categories/${categoryId}`)
    await this.saveCategory(storeId, response.data)
    return response.data
  }

  async list(storeId: number, params: any = {}) {
    const client = await this.wooCommerceClientService.getClient(storeId)
    const response = await client.get('products/categories', params)

    if (Array.isArray(response.data)) {
      for (const category of response.data) {
        await this.saveCategory(storeId, category)
      }
    }

    return response.data
  }

  async update(
    storeId: number,
    categoryId: number,
    data: UpdateProductCategoryDto,
  ) {
    const client = await this.wooCommerceClientService.getClient(storeId)
    const response = await client.put(`products/categories/${categoryId}`, data)
    await this.saveCategory(storeId, response.data)
    return response.data
  }

  async delete(storeId: number, categoryId: number, force = true) {
    const client = await this.wooCommerceClientService.getClient(storeId)
    const response = await client.delete(`products/categories/${categoryId}`, {
      force,
    })
    await this.categoryRepository.delete({ store_id: storeId, category_id: categoryId })
    return response.data
  }

  async batch(storeId: number, data: BatchProductCategoryDto) {
    const client = await this.wooCommerceClientService.getClient(storeId)
    const response = await client.post('products/categories/batch', data)

    if (response.data.create) {
      for (const category of response.data.create) {
        await this.saveCategory(storeId, category)
      }
    }
    if (response.data.update) {
      for (const category of response.data.update) {
        await this.saveCategory(storeId, category)
      }
    }
    if (response.data.delete) {
      for (const category of response.data.delete) {
        await this.categoryRepository.delete({
          store_id: storeId,
          category_id: category.id,
        })
      }
    }

    return response.data
  }

  private async saveCategory(storeId: number, categoryData: any) {
    const existing = await this.categoryRepository.findOne({
      where: { store_id: storeId, category_id: categoryData.id },
    })

    const entity = existing || new WooCommerceProductCategoryEntity()
    entity.store_id = storeId
    entity.category_id = categoryData.id
    entity.name = categoryData.name
    entity.slug = categoryData.slug
    entity.parent = categoryData.parent
    entity.description = categoryData.description
    entity.display = categoryData.display
    entity.image = categoryData.image
    entity.menu_order = categoryData.menu_order
    entity.count = categoryData.count

    return this.categoryRepository.save(entity)
  }
}
