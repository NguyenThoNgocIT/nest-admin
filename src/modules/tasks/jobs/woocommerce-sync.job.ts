import { Injectable } from '@nestjs/common'
import { StoreCredentialsService } from '~/integrations/woocommerce/services/store-credentials.service'
import { WooCommerceAdapter } from '~/integrations/woocommerce/woocommerce.adapter'
import { LoggerService } from '~/shared/logger/logger.service'
import { Mission } from '../mission.decorator'

@Injectable()
@Mission()
export class WooCommerceSyncJob {
  constructor(
    private readonly wooAdapter: WooCommerceAdapter,
    private readonly storeService: StoreCredentialsService,
    private readonly logger: LoggerService,
  ) {}

  async syncAll(): Promise<void> {
    this.logger.log('Starting WooCommerce sync job...', WooCommerceSyncJob.name)
    const stores = await this.storeService.getAllActiveStores()

    for (const store of stores) {
      try {
        this.logger.log(`Syncing store: ${store.name}`, WooCommerceSyncJob.name)
        await this.wooAdapter.syncProducts(store.id)
        await this.wooAdapter.syncOrders(store.id)
        this.logger.log(`Synced store: ${store.name}`, WooCommerceSyncJob.name)
      }
      catch (error) {
        this.logger.error(`Failed to sync store ${store.name}: ${error.message}`, WooCommerceSyncJob.name)
      }
    }
    this.logger.log('WooCommerce sync job completed.', WooCommerceSyncJob.name)
  }
}
