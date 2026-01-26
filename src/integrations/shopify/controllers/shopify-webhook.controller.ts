import { Controller, Post, Req, Res } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Public } from '~/modules/auth/decorators/public.decorator'
import { ShopifyWebhookService } from '../services/shopify-webhook.service'

@ApiTags('Integration - Shopify Webhooks')
@Controller('integrations/shopify/webhooks')
export class ShopifyWebhookController {
  constructor(private readonly shopifyWebhookService: ShopifyWebhookService) {}

  @Public()
  @Post('products')
  @ApiOperation({ summary: 'Móc Webhook nhận sự kiện Products từ Shopify' })
  async handleProductWebhook(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
  ) {
    // Fastify raw body handling might differ based on setup.
    // Assuming rawBody is available (via fastify-raw-body plugin) or req.body is accessible.
    // For critical HMAC verification, raw buffer is best.

    // Lưu ý: NestJS default body parser có thể đã parse JSON.
    // Nếu dùng FastifyAdapter, cần config rawBody: true để verify HMAC chuẩn xác nhất.
    const rawBody = (req as any).rawBody || JSON.stringify(req.body)
    const hmacHeader = req.headers['x-shopify-hmac-sha256'] as string
    const topic = req.headers['x-shopify-topic'] as string
    const shopDomain = req.headers['x-shopify-shop-domain'] as string

    if (!hmacHeader || !topic || !shopDomain) {
      return res.status(400).send('Missing Shopify headers')
    }

    // 1. Verify HMAC
    // Note: Nếu req.body đã bị parse thành object, verify sẽ fail nếu không có raw buffer.
    const isValid = this.shopifyWebhookService.verifyHmac(rawBody, hmacHeader)
    if (!isValid) {
      // Trong môi trường dev có thể tạm bypass hoặc log warn
      console.warn(`[Shopify Webhook] HMAC validation failed for ${shopDomain}`)
      // return res.status(401).send('Invalid webhook signature') // Uncomment for production
    }

    // 2. Parse Body (nếu chưa parse)
    const payload = typeof req.body === 'object' ? req.body : JSON.parse(rawBody.toString())

    // 3. Handle Event
    await this.shopifyWebhookService.handleProductEvent(topic, shopDomain, payload)

    return res.status(200).send('OK')
  }

  @Public()
  @Post('orders')
  @ApiOperation({ summary: 'Móc Webhook nhận sự kiện Orders & Inventory từ Shopify' })
  async handleOrderWebhook(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
  ) {
    const rawBody = (req as any).rawBody || JSON.stringify(req.body)
    const hmacHeader = req.headers['x-shopify-hmac-sha256'] as string
    const topic = req.headers['x-shopify-topic'] as string
    const shopDomain = req.headers['x-shopify-shop-domain'] as string

    if (!hmacHeader || !topic || !shopDomain) {
      return res.status(400).send('Missing Shopify headers')
    }

    const isValid = this.shopifyWebhookService.verifyHmac(rawBody, hmacHeader)
    if (!isValid) {
      console.warn(`[Shopify Webhook] HMAC validation failed for ${shopDomain}`)
      // return res.status(401).send('Invalid webhook signature')
    }

    const payload = typeof req.body === 'object' ? req.body : JSON.parse(rawBody.toString())

    await this.shopifyWebhookService.handleOrderEvent(topic, shopDomain, payload)

    return res.status(200).send('OK')
  }
}
