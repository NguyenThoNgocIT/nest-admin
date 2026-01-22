import { Injectable, Logger } from '@nestjs/common'
import { WooCommerceClientService } from './woocommerce-client.service'

@Injectable()
export class SystemStatusService {
  private readonly logger = new Logger(SystemStatusService.name)

  constructor(
    private readonly clientService: WooCommerceClientService,
  ) {}

  /**
   * List all system status items
   */
  async listAll(storeId: number) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.get('system_status')

      return response.data
    }
    catch (error) {
      this.logger.error(`Error listing system status: ${error.message}`, error.stack)
      throw error
    }
  }
}
