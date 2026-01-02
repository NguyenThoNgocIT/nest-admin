import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateProductDto } from '../dto/create-product.dto'
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

  async syncProducts(storeId: number) {
    const products = await this.getProducts(storeId, { per_page: 100 }) // Fetch first 100 for demo
    const savedProducts = []

    for (const p of products) {
      let entity = await this.productRepository.findOne({ where: { storeId, wcId: p.id } })
      if (!entity) {
        entity = new WooCommerceProductEntity()
        entity.storeId = storeId
        entity.wcId = p.id
      }
      entity.name = p.name
      entity.sku = p.sku
      entity.price = p.price ? Number.parseFloat(p.price) : 0
      entity.status = p.status
      entity.rawData = p

      savedProducts.push(await this.productRepository.save(entity))
    }
    return savedProducts
  }
}
