// src/integrations/tiktok-seller/controllers/tiktok-seller.controller.ts

import { Controller, Get, Logger, Query, Res, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { FastifyReply } from 'fastify'

import { AuthUser } from '~/modules/auth/decorators/auth-user.decorator'
import { Public } from '~/modules/auth/decorators/public.decorator'
import { JwtAuthGuard } from '~/modules/auth/guards/jwt-auth.guard'

import { TikTokSellerOAuthService } from '../services/tiktok-seller-oauth.service'

@ApiTags('Integration - TikTok Seller')
@Controller('integrations/tiktok')
export class TikTokSellerController {
  private readonly logger = new Logger(TikTokSellerController.name)

  constructor(private readonly oauthService: TikTokSellerOAuthService) {}

  /**
   * 🔗 Connect endpoint - Redirect to TikTok authorization
   *
   * ⚠️ CRITICAL FIX: Không return khi dùng @Res() với Fastify
   */
  @UseGuards(JwtAuthGuard)
  @Get('connect')
  @ApiOperation({ summary: 'Bắt đầu kết nối TikTok Shop (Redirect tới TikTok)' })
  async connect(
    @Res() res: FastifyReply,
    @AuthUser() user: IAuthUser,
  ) {
    try {
      const url = await this.oauthService.getAuthorizationUrl(user.uid)

      this.logger.debug(`Redirecting user ${user.uid} to TikTok auth: ${url}`)

      // ✅ FIX: Không return khi dùng Fastify
      res.status(302).redirect(url)
    }
    catch (error) {
      this.logger.error(`Failed to generate auth URL: ${error.message}`)
      res.status(500).send({
        success: false,
        message: 'Failed to initiate TikTok connection',
        error: error.message,
      })
    }
  }

  /**
   * 🔄 OAuth Callback - TikTok redirects here after authorization
   *
   * Query params: ?code=...&state=...
   */
  @Public()
  @Get('callback')
  @ApiOperation({ summary: 'TikTok OAuth Callback URL' })
  async callback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: FastifyReply,
  ) {
    // Validate required params
    if (!code || !state) {
      this.logger.error('Missing code or state in callback')
      return res.status(400).send({
        success: false,
        message: 'Missing "code" or "state" parameters.',
      })
    }

    try {
      // Handle OAuth callback and save store
      const store = await this.oauthService.handleCallback(code, state)

      this.logger.log(`Successfully connected TikTok shop: ${store.shopName} (${store.shopId})`)

      // Success page (since no frontend yet)
      return res.type('text/html').send(`
        <!DOCTYPE html>
        <html lang="vi">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>TikTok Shop Connected</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 20px;
              }
              .container {
                background: white;
                padding: 48px 40px;
                border-radius: 16px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                text-align: center;
                max-width: 480px;
                width: 100%;
                animation: slideUp 0.4s ease-out;
              }
              @keyframes slideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .icon {
                font-size: 64px;
                margin-bottom: 24px;
                animation: bounce 0.6s ease-in-out;
              }
              @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
              }
              h1 {
                color: #1a1a1a;
                margin: 0 0 16px;
                font-size: 28px;
                font-weight: 600;
              }
              .shop-info {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 12px;
                margin: 24px 0;
              }
              .shop-name {
                font-weight: 600;
                color: #667eea;
                font-size: 20px;
                display: block;
                margin-bottom: 8px;
              }
              .shop-id {
                font-size: 14px;
                color: #6c757d;
              }
              p {
                color: #666;
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 24px;
              }
              .badge {
                display: inline-block;
                background: #28a745;
                color: white;
                padding: 6px 16px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 500;
                margin-top: 8px;
              }
              .footer {
                margin-top: 32px;
                padding-top: 24px;
                border-top: 1px solid #e9ecef;
                font-size: 14px;
                color: #999;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="icon">✅</div>
              <h1>Kết nối thành công!</h1>
              
              <div class="shop-info">
                <span class="shop-name">${store.shopName}</span>
                <span class="shop-id">Shop ID: ${store.shopId}</span>
                <div class="badge">🔗 Đã kết nối</div>
              </div>
              
              <p>
                Cửa hàng TikTok Shop của bạn đã được liên kết thành công với hệ thống.
                Bây giờ bạn có thể đồng bộ đơn hàng và sản phẩm.
              </p>
              
              <div class="footer">
                Bạn có thể đóng cửa sổ này và quay lại trang quản trị.
              </div>
            </div>
          </body>
        </html>
      `)
    }
    catch (error) {
      this.logger.error(`TikTok OAuth callback failed: ${error.message}`, error.stack)

      // Error page
      return res.type('text/html').send(`
        <!DOCTYPE html>
        <html lang="vi">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>TikTok Shop Connection Failed</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                padding: 20px;
              }
              .container {
                background: white;
                padding: 48px 40px;
                border-radius: 16px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                text-align: center;
                max-width: 480px;
                width: 100%;
              }
              .icon { font-size: 64px; margin-bottom: 24px; }
              h1 { color: #dc3545; margin: 0 0 16px; font-size: 28px; font-weight: 600; }
              p { color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 24px; }
              .error-detail {
                background: #fff3cd;
                border: 1px solid #ffc107;
                padding: 16px;
                border-radius: 8px;
                font-size: 14px;
                color: #856404;
                word-break: break-word;
              }
              .footer {
                margin-top: 32px;
                padding-top: 24px;
                border-top: 1px solid #e9ecef;
                font-size: 14px;
                color: #999;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="icon">❌</div>
              <h1>Kết nối thất bại</h1>
              <p>Không thể kết nối với TikTok Shop. Vui lòng thử lại.</p>
              
              <div class="error-detail">
                <strong>Lỗi:</strong> ${error.message}
              </div>
              
              <div class="footer">
                Vui lòng đóng cửa sổ này và thử kết nối lại.
              </div>
            </div>
          </body>
        </html>
      `)
    }
  }
}
