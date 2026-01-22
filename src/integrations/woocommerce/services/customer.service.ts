import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateCustomerDto, UpdateCustomerDto } from '../dto/create-customer.dto'
import { WooCommerceCustomerEntity } from '../entities/woocommerce-customer.entity'
import { WooCommerceClientService } from './woocommerce-client.service'

@Injectable()
export class CustomerService {
  constructor(
    private readonly clientService: WooCommerceClientService,
    @InjectRepository(WooCommerceCustomerEntity)
    private readonly customerRepository: Repository<WooCommerceCustomerEntity>,
  ) {}

  async createCustomer(storeId: number, data: CreateCustomerDto) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.post('customers', data)
    return response.data
  }

  async getCustomers(storeId: number, params?: any) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.get('customers', params)
    return response.data
  }

  async getCustomer(storeId: number, customerId: number) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.get(`customers/${customerId}`)
    return response.data
  }

  async updateCustomer(storeId: number, customerId: number, data: UpdateCustomerDto) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.put(`customers/${customerId}`, data)
    return response.data
  }

  async deleteCustomer(storeId: number, customerId: number, force = true) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.delete(`customers/${customerId}`, { force })
    return response.data
  }

  async getCustomerDownloads(storeId: number, customerId: number) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.get(`customers/${customerId}/downloads`)
    return response.data
  }

  async syncCustomers(storeId: number) {
    const customers = await this.getCustomers(storeId, { per_page: 100 })
    const savedCustomers = []

    for (const c of customers) {
      let entity = await this.customerRepository.findOne({ where: { storeId, wcId: c.id } })
      if (!entity) {
        entity = new WooCommerceCustomerEntity()
        entity.storeId = storeId
        entity.wcId = c.id
      }

      entity.email = c.email
      entity.firstName = c.first_name
      entity.lastName = c.last_name
      entity.username = c.username
      entity.role = c.role
      entity.billing = c.billing
      entity.shipping = c.shipping
      entity.isPayingCustomer = c.is_paying_customer
      entity.avatarUrl = c.avatar_url
      entity.metaData = c.meta_data
      entity.rawData = c

      savedCustomers.push(await this.customerRepository.save(entity))
    }
    return savedCustomers
  }
}
