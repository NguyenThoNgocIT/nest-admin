import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateOrderNoteDto, SendOrderDetailsDto, SendOrderEmailDto } from '../dto/order-actions.dto'
import { WooCommerceOrderNoteEntity } from '../entities/woocommerce-order-note.entity'
import { WooCommerceClientService } from './woocommerce-client.service'

@Injectable()
export class OrderActionsService {
  constructor(
    private readonly clientService: WooCommerceClientService,
    @InjectRepository(WooCommerceOrderNoteEntity)
    private readonly orderNoteRepository: Repository<WooCommerceOrderNoteEntity>,
  ) {}

  // Order Actions
  async sendOrderDetails(storeId: number, orderId: number, data: SendOrderDetailsDto) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.post(`orders/${orderId}/actions/send_order_details`, data)
    return response.data
  }

  async sendOrderEmail(storeId: number, orderId: number, data: SendOrderEmailDto) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.post(`orders/${orderId}/actions/send_email`, data)
    return response.data
  }

  async getEmailTemplates(storeId: number, orderId: number) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.get(`orders/${orderId}/actions/email_templates`)
    return response.data
  }

  // Order Notes
  async createOrderNote(storeId: number, orderId: number, data: CreateOrderNoteDto) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.post(`orders/${orderId}/notes`, data)
    return response.data
  }

  async getOrderNote(storeId: number, orderId: number, noteId: number) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.get(`orders/${orderId}/notes/${noteId}`)
    return response.data
  }

  async getOrderNotes(storeId: number, orderId: number, params?: any) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.get(`orders/${orderId}/notes`, params)
    return response.data
  }

  async deleteOrderNote(storeId: number, orderId: number, noteId: number, force = true) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.delete(`orders/${orderId}/notes/${noteId}`, { force })
    return response.data
  }

  async syncOrderNotes(storeId: number, orderId: number) {
    const notes = await this.getOrderNotes(storeId, orderId)
    const savedNotes = []

    for (const n of notes) {
      let entity = await this.orderNoteRepository.findOne({
        where: { storeId, orderId, noteId: n.id },
      })
      if (!entity) {
        entity = new WooCommerceOrderNoteEntity()
        entity.storeId = storeId
        entity.orderId = orderId
        entity.noteId = n.id
      }

      entity.author = n.author
      entity.note = n.note
      entity.customerNote = n.customer_note
      entity.addedByUser = n.added_by_user || false
      entity.dateCreated = n.date_created ? new Date(n.date_created) : null

      savedNotes.push(await this.orderNoteRepository.save(entity))
    }
    return savedNotes
  }
}
