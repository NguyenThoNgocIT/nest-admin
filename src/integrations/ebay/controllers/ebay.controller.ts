// src/integrations/ebay/controllers/ebay.controller.ts

import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { FastifyReply } from 'fastify'

import { AuthUser } from '~/modules/auth/decorators/auth-user.decorator'
import { Public } from '~/modules/auth/decorators/public.decorator'
import { JwtAuthGuard } from '~/modules/auth/guards/jwt-auth.guard'
import { EbayOAuthService } from '../services/ebay-oauth.service'

@ApiTags('Integration - eBay')
@Controller('integrations/ebay')
export class EbayController {
  constructor(private readonly oauthService: EbayOAuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('connect')
  @ApiOperation({ summary: 'Bắt đầu quy trình kết nối eBay (OAuth)' })
  async connect(
    @Res() res: FastifyReply,
    @AuthUser() user: IAuthUser,
  ) {
    // user.uid phải tồn tại, nếu IAuthUser khác thì sửa lại cho khớp
    const url = await this.oauthService.getAuthorizationUrl(user.uid)
    return res.status(302).redirect(url)
  }

  @Public()
  @Get('callback')
  @ApiOperation({ summary: 'eBay OAuth Callback' })
  async callback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: FastifyReply,
  ) {
    if (!code || !state) {
      return res.status(400).send('Missing code or state')
    }

    try {
      await this.oauthService.handleCallback(code, state)

      // Trả về trang HTML báo thành công
      return res.type('text/html').send(`
        <html>
          <head>
              <style>
                  body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f4f6f8; }
                  .card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
                  .success { color: #28a745; font-size: 1.5rem; margin-bottom: 1rem; }
                  .logo { font-weight: bold; font-size: 2rem; color: #e53238; margin-bottom: 0.5rem; }
                  .logo span:nth-child(2) { color: #0064d2; }
                  .logo span:nth-child(3) { color: #f5af02; }
                  .logo span:nth-child(4) { color: #86b817; }
              </style>
          </head>
          <body>
            <div class="card">
              <div class="logo"><span>e</span><span>b</span><span>a</span><span>y</span></div>
              <div class="success">✓ Connection Successful!</div>
              <p>Your eBay account has been linked successfully.</p>
              <p>You can close this window now.</p>
            </div>
          </body>
        </html>
      `)
    }
    catch (error) {
      return res.status(500).send(`eBay Connection Failed: ${error.message}`)
    }
  }
}
