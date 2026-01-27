import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { lastValueFrom } from 'rxjs'
import { ETSY_API_URL } from '../constants/etsy.constant'

@Injectable()
export class EtsyClientService {
  private readonly logger = new Logger(EtsyClientService.name)

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private get apiKey() {
    return this.configService.get<string>('ETSY_API_KEY')
  }

  /**
   * Gọi thông tin người dùng hiện tại (users/__SELF__)
   * Để lấy Etsy User ID
   */
  async getSelf(accessToken: string) {
    const url = `${ETSY_API_URL}/application/users/__SELF__`
    try {
      const response = await lastValueFrom(
        this.httpService.get(url, {
          headers: {
            'x-api-key': this.apiKey,
            'Authorization': `Bearer ${accessToken}`,
          },
        }),
      )
      return response.data
    }
    catch (error) {
      this.logger.error(`Error fetching self user: ${error.message}`, error.response?.data)
      throw error
    }
  }

  /**
   * Lấy danh sách Shop của User
   * Để lấy Shop ID
   */
  async getShopByUserId(userId: string | number, accessToken: string) {
    // API v3: GET /application/users/{user_id}/shops
    const url = `${ETSY_API_URL}/application/users/${userId}/shops`
    try {
      const response = await lastValueFrom(
        this.httpService.get(url, {
          headers: {
            'x-api-key': this.apiKey,
            'Authorization': `Bearer ${accessToken}`,
          },
        }),
      )
      // Etsy trả về mảng, ta lấy shop đầu tiên (thường user chỉ có 1 shop chính hoặc list)
      // Tùy logic bussiness, ở đây ta lấy shop[0]
      return response.data?.results?.[0] || response.data?.[0]
    }
    catch (error) {
      this.logger.error(`Error fetching shop for user ${userId}: ${error.message}`, error.response?.data)
      throw error
    }
  }
}
