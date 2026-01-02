import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SyncOrderDto } from '../dto/sync-order.dto'
import { WooCommerceOrderEntity } from '../entities/woocommerce-order.entity'
import { WooCommerceClientService } from './woocommerce-client.service'

@Injectable()
export class OrderService {
  constructor(
    private readonly clientService: WooCommerceClientService,
    @InjectRepository(WooCommerceOrderEntity)
    private readonly orderRepository: Repository<WooCommerceOrderEntity>,
  ) {}

  async getOrders(storeId: number, params: SyncOrderDto) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.get('orders', params)
    return response.data
  }

  async getOrder(storeId: number, orderId: number) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.get(`orders/${orderId}`)
    return response.data
  }

  async syncOrders(storeId: number) {
    const orders = await this.getOrders(storeId, { per_page: 100 })
    const savedOrders = []

    for (const o of orders) {
      let entity = await this.orderRepository.findOne({ where: { storeId, wcId: o.id } })
      if (!entity) {
        entity = new WooCommerceOrderEntity()
        entity.storeId = storeId
        entity.wcId = o.id
      }
      entity.number = o.number
      entity.status = o.status
      entity.total = Number.parseFloat(o.total)
      entity.currency = o.currency
      entity.rawData = o

      savedOrders.push(await this.orderRepository.save(entity))
    }
    return savedOrders
  }
}
