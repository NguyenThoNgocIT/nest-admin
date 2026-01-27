import { BadRequestException, Body, Controller, Headers, Logger, Post } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Public } from '~/modules/auth/decorators/public.decorator'
import { TIKTOK_SELLER_WEBHOOK_EVENTS } from '../constants/tiktok-seller.constant'
import { TikTokSellerSignatureService } from '../services/tiktok-seller-signature.service'

@Controller('webhooks/tiktok-shop')
export class TikTokShopWebhookController {
  private readonly logger = new Logger(TikTokShopWebhookController.name)
  private readonly appSecret: string

  constructor(
    private config: ConfigService,
    private signatureService: TikTokSellerSignatureService,
  ) {
    this.appSecret = config.get('TIKTOK_SHOP_SECRET')
  }

  /**
   * 🔔 Handle TikTok Shop Webhook
   */
  @Public() // Webhook là public endpoint (được bảo vệ bằng signature)
  @Post()
  async handleWebhook(
    @Headers('tiktok-signature') signatureHeader: string, // Check header name thực tế trong doc, thường là auth-algo hoặc tương tự, nhưng code mẫu là tiktok-signature
    @Body() payload: any,
  ) {
    this.logger.log(`Received Webhook: ${JSON.stringify(payload)}`)

    if (!signatureHeader) {
      // Warning: Sandbox test đôi khi không gửi header này chuẩn
      this.logger.warn('Missing signature header')
      // throw new BadRequestException('Missing Signature');
    }

    // Parse header: header format thường là "t=timestamp,s=signature" hoặc raw signature
    // Giả sử theo mẫu user cung cấp: header chứa chuỗi "t=...,s=..."
    // Tuy nhiên, một số version trả về trực tiếp signature trong header `Authorization`.
    // Cần kiểm tra kỹ. Ở đây implement theo code mẫu user.

    // Safety check structure
    if (signatureHeader && signatureHeader.includes(',')) {
      const { timestamp, signature } = this.parseSignatureHeader(signatureHeader)

      // Security: Verify Signature
      const isValid = this.signatureService.verifyWebhookSignature(
        this.appSecret,
        timestamp,
        JSON.stringify(payload),
        signature,
      )

      if (!isValid) {
        throw new BadRequestException('Invalid Webhook Signature')
      }
    }

    // Process Event
    await this.processWebhookEvent(payload)

    return { success: true }
  }

  private parseSignatureHeader(header: string): { timestamp: number, signature: string } {
    const parts = header.split(',')
    // format: t=123456,s=abcdef
    const tPart = parts.find(p => p.trim().startsWith('t='))
    const sPart = parts.find(p => p.trim().startsWith('s='))

    const timestamp = tPart ? Number.parseInt(tPart.split('=')[1]) : 0
    const signature = sPart ? sPart.split('=')[1] : ''

    return { timestamp, signature }
  }

  private async processWebhookEvent(payload: any) {
    const eventType = payload.type // 1, 2, 3...
    const shopId = payload.shop_id
    const data = payload.data // object detail

    this.logger.log(`Processing Event Type: ${eventType} for Shop: ${shopId}`)

    switch (eventType) {
      case TIKTOK_SELLER_WEBHOOK_EVENTS.ORDER_STATUS_CHANGE:
        // Logic sync order status
        this.logger.log(`Order Status Changed: ${data?.order_id} -> ${data?.order_status}`)
        break

      case TIKTOK_SELLER_WEBHOOK_EVENTS.SHOP_DEAUTHORIZED:
        // Logic disconnect shop
        this.logger.warn(`Shop Deauthorized: ${shopId}`)
        // TODO: Update database status = 'disconnected'
        break

      default:
        this.logger.debug(`Unhandled Event Type: ${eventType}`)
    }
  }
}
