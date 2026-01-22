import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BatchWebhookDto, CreateWebhookDto, UpdateWebhookDto } from '../dto/webhook.dto'
import { WooCommerceWebhookEntity } from '../entities/woocommerce-webhook.entity'
import { WooCommerceClientService } from './woocommerce-client.service'

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name)

  constructor(
    private readonly clientService: WooCommerceClientService,
    @InjectRepository(WooCommerceWebhookEntity)
    private readonly webhookRepository: Repository<WooCommerceWebhookEntity>,
  ) {}

  /**
   * Create a webhook
   */
  async create(storeId: number, data: CreateWebhookDto) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.post('webhooks', data)
      await this.saveToDb(storeId, response.data)
      return response.data
    }
    catch (error) {
      this.logger.error(`Error creating webhook: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * Retrieve a webhook
   */
  async retrieve(storeId: number, id: number) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.get(`webhooks/${id}`)
      await this.saveToDb(storeId, response.data)
      return response.data
    }
    catch (error) {
      this.logger.error(`Error retrieving webhook: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * List all webhooks
   */
  async listAll(storeId: number, params?: any) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.get('webhooks', params)

      // Batch save to DB
      for (const item of response.data) {
        await this.saveToDb(storeId, item)
      }

      return response.data
    }
    catch (error) {
      this.logger.error(`Error listing webhooks: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * Update a webhook
   */
  async update(storeId: number, id: number, data: UpdateWebhookDto) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.put(`webhooks/${id}`, data)
      await this.saveToDb(storeId, response.data)
      return response.data
    }
    catch (error) {
      this.logger.error(`Error updating webhook: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * Delete a webhook
   */
  async delete(storeId: number, id: number, force = false) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.delete(`webhooks/${id}`, { force })
      await this.webhookRepository.delete({ id, store_id: storeId })
      return response.data
    }
    catch (error) {
      this.logger.error(`Error deleting webhook: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * Batch update webhooks
   */
  async batch(storeId: number, data: BatchWebhookDto) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.post('webhooks/batch', data)

      if (response.data.create) {
        for (const item of response.data.create) {
          await this.saveToDb(storeId, item)
        }
      }
      if (response.data.update) {
        for (const item of response.data.update) {
          await this.saveToDb(storeId, item)
        }
      }
      if (response.data.delete) {
        for (const item of response.data.delete) {
          await this.webhookRepository.delete({ id: item.id, store_id: storeId })
        }
      }

      return response.data
    }
    catch (error) {
      this.logger.error(`Error batch updating webhooks: ${error.message}`, error.stack)
      throw error
    }
  }

  private async saveToDb(storeId: number, data: any) {
    const entity = this.webhookRepository.create({
      id: data.id,
      store_id: storeId,
      name: data.name,
      status: data.status,
      topic: data.topic,
      resource: data.resource,
      event: data.event,
      hooks: data.hooks,
      delivery_url: data.delivery_url,
      secret: data.secret,
      date_created: data.date_created ? new Date(data.date_created) : null,
      date_created_gmt: data.date_created_gmt ? new Date(data.date_created_gmt) : null,
      date_modified: data.date_modified ? new Date(data.date_modified) : null,
      date_modified_gmt: data.date_modified_gmt ? new Date(data.date_modified_gmt) : null,
    })
    return this.webhookRepository.save(entity)
  }
}
