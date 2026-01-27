import { Injectable } from '@nestjs/common'
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'
import { StoreCredentialsService } from './store-credentials.service'

@Injectable()
export class WooCommerceClientService {
  constructor(private readonly credentialsService: StoreCredentialsService) {}

  async getClient(storeId: number): Promise<WooCommerceRestApi> {
    const store = await this.credentialsService.getCredentials(storeId)
    if (!store) {
      throw new Error(`Store with ID ${storeId} not found`)
    }

    return new WooCommerceRestApi({
      url: store.url,
      consumerKey: store.consumerKey,
      consumerSecret: store.consumerSecret,
      version: 'wc/v3',
      queryStringAuth: true, // Often needed for some setups
    })
  }
}
