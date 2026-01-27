import { Injectable, Logger } from '@nestjs/common'
import {
  ReportListDto,
  ReportSalesDto,
  ReportTopSellerDto,
  ReportTotalDto,
} from '../dto/report.dto'
import { WooCommerceClientService } from './woocommerce-client.service'

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name)

  constructor(private readonly wooCommerceClient: WooCommerceClientService) {}

  /**
   * List all reports
   * @param storeId Store ID
   * @returns List of available reports
   */
  async listAll(storeId: number): Promise<ReportListDto[]> {
    try {
      const client = await this.wooCommerceClient.getClient(storeId)
      const response = await client.get('reports')
      return response.data
    }
    catch (error) {
      this.logger.error(`Error listing reports: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * Retrieve sales report
   * @param storeId Store ID
   * @param params Query parameters (period, date_min, date_max)
   * @returns Sales report data
   */
  async getSalesReport(storeId: number, params?: any): Promise<ReportSalesDto[]> {
    try {
      const client = await this.wooCommerceClient.getClient(storeId)
      const response = await client.get('reports/sales', params)
      return response.data
    }
    catch (error) {
      this.logger.error(
        `Error getting sales report: ${error.message}`,
        error.stack,
      )
      throw error
    }
  }

  /**
   * Retrieve top sellers report
   * @param storeId Store ID
   * @param params Query parameters (period, date_min, date_max)
   * @returns Top sellers list
   */
  async getTopSellers(storeId: number, params?: any): Promise<ReportTopSellerDto[]> {
    try {
      const client = await this.wooCommerceClient.getClient(storeId)
      const response = await client.get(
        'reports/top_sellers',
        params,
      )
      return response.data
    }
    catch (error) {
      this.logger.error(
        `Error getting top sellers report: ${error.message}`,
        error.stack,
      )
      throw error
    }
  }

  /**
   * Retrieve coupons totals
   * @param storeId Store ID
   * @returns Coupons totals
   */
  async getCouponsTotals(storeId: number): Promise<ReportTotalDto[]> {
    try {
      const client = await this.wooCommerceClient.getClient(storeId)
      const response = await client.get(
        'reports/coupons/totals',
      )
      return response.data
    }
    catch (error) {
      this.logger.error(
        `Error getting coupons totals: ${error.message}`,
        error.stack,
      )
      throw error
    }
  }

  /**
   * Retrieve customers totals
   * @param storeId Store ID
   * @returns Customers totals
   */
  async getCustomersTotals(storeId: number): Promise<ReportTotalDto[]> {
    try {
      const client = await this.wooCommerceClient.getClient(storeId)
      const response = await client.get(
        'reports/customers/totals',
      )
      return response.data
    }
    catch (error) {
      this.logger.error(
        `Error getting customers totals: ${error.message}`,
        error.stack,
      )
      throw error
    }
  }

  /**
   * Retrieve orders totals
   * @param storeId Store ID
   * @returns Orders totals
   */
  async getOrdersTotals(storeId: number): Promise<ReportTotalDto[]> {
    try {
      const client = await this.wooCommerceClient.getClient(storeId)
      const response = await client.get(
        'reports/orders/totals',
      )
      return response.data
    }
    catch (error) {
      this.logger.error(
        `Error getting orders totals: ${error.message}`,
        error.stack,
      )
      throw error
    }
  }

  /**
   * Retrieve products totals
   * @param storeId Store ID
   * @returns Products totals
   */
  async getProductsTotals(storeId: number): Promise<ReportTotalDto[]> {
    try {
      const client = await this.wooCommerceClient.getClient(storeId)
      const response = await client.get(
        'reports/products/totals',
      )
      return response.data
    }
    catch (error) {
      this.logger.error(
        `Error getting products totals: ${error.message}`,
        error.stack,
      )
      throw error
    }
  }

  /**
   * Retrieve reviews totals
   * @param storeId Store ID
   * @returns Reviews totals
   */
  async getReviewsTotals(storeId: number): Promise<ReportTotalDto[]> {
    try {
      const client = await this.wooCommerceClient.getClient(storeId)
      const response = await client.get(
        'reports/reviews/totals',
      )
      return response.data
    }
    catch (error) {
      this.logger.error(
        `Error getting reviews totals: ${error.message}`,
        error.stack,
      )
      throw error
    }
  }
}
