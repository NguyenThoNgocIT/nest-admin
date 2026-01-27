import { Injectable, Logger } from '@nestjs/common'
import { RunSystemStatusToolDto } from '../dto/system-status-tool.dto'
import { WooCommerceClientService } from './woocommerce-client.service'

@Injectable()
export class SystemStatusToolService {
  private readonly logger = new Logger(SystemStatusToolService.name)

  constructor(
    private readonly clientService: WooCommerceClientService,
  ) {}

  /**
   * List all system status tools
   */
  async listAll(storeId: number) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.get('system_status/tools')

      return response.data
    }
    catch (error) {
      this.logger.error(`Error listing system status tools: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * Retrieve a tool from system status
   */
  async retrieve(storeId: number, id: string) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.get(`system_status/tools/${id}`)

      return response.data
    }
    catch (error) {
      this.logger.error(`Error retrieving system status tool ${id}: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * Run a tool from system status
   */
  async runTool(storeId: number, id: string, data: RunSystemStatusToolDto) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.put(`system_status/tools/${id}`, data)

      return response.data
    }
    catch (error) {
      this.logger.error(`Error running system status tool ${id}: ${error.message}`, error.stack)
      throw error
    }
  }
}
