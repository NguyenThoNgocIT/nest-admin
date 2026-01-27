import { Injectable, Logger } from '@nestjs/common'
import { WooCommerceClientService } from './woocommerce-client.service'

@Injectable()
export class DataService {
  private readonly logger = new Logger(DataService.name)

  constructor(
    private readonly clientService: WooCommerceClientService,
  ) {}

  /**
   * List all data resources
   */
  async listDataResources(storeId: number) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.get('data')
      return response.data
    }
    catch (error) {
      this.logger.error(`Error listing data resources: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * List all continents
   */
  async listContinents(storeId: number) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.get('data/continents')
      return response.data
    }
    catch (error) {
      this.logger.error(`Error listing continents: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * Retrieve a continent
   */
  async getContinent(storeId: number, location: string) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.get(`data/continents/${location}`)
      return response.data
    }
    catch (error) {
      this.logger.error(`Error retrieving continent ${location}: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * List all countries
   */
  async listCountries(storeId: number) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.get('data/countries')
      return response.data
    }
    catch (error) {
      this.logger.error(`Error listing countries: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * Retrieve a country
   */
  async getCountry(storeId: number, location: string) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.get(`data/countries/${location}`)
      return response.data
    }
    catch (error) {
      this.logger.error(`Error retrieving country ${location}: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * List all currencies
   */
  async listCurrencies(storeId: number) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.get('data/currencies')
      return response.data
    }
    catch (error) {
      this.logger.error(`Error listing currencies: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * Retrieve a currency
   */
  async getCurrency(storeId: number, currency: string) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.get(`data/currencies/${currency}`)
      return response.data
    }
    catch (error) {
      this.logger.error(`Error retrieving currency ${currency}: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * Retrieve current currency
   */
  async getCurrentCurrency(storeId: number) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.get('data/currencies/current')
      return response.data
    }
    catch (error) {
      this.logger.error(`Error retrieving current currency: ${error.message}`, error.stack)
      throw error
    }
  }
}
