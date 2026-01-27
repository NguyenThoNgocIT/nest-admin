import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { FastifyReply } from 'fastify'

import { AuthUser } from '~/modules/auth/decorators/auth-user.decorator'
import { Public } from '~/modules/auth/decorators/public.decorator'
import { JwtAuthGuard } from '~/modules/auth/guards/jwt-auth.guard'
import { EtsyOAuthService } from '../services/etsy-oauth.service'

@ApiTags('Integration - Etsy')
@Controller('integrations/etsy')
export class EtsyController {
  constructor(private readonly etsyOAuthService: EtsyOAuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('connect')
  @ApiOperation({ summary: 'Bắt đầu quy trình kết nối Etsy (OAuth PKCE)' })
  async connect(
    @Res() res: FastifyReply,
    @AuthUser() user: IAuthUser,
  ) {
    const url = await this.etsyOAuthService.generateAuthUrl(user.uid)
    return res.status(302).redirect(url)
  }

  @Public()
  @Get('oauth/callback')
  @ApiOperation({ summary: 'Etsy OAuth Callback' })
  async callback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Res() res: FastifyReply,
  ) {
    await this.etsyOAuthService.handleCallback(code, state, error)

    // Trả về trang thành công (tương tự Shopify)
    return res.type('text/html').send(`
      <html>
        <head>
            <style>
                body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f4f6f8; }
                .card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
                .success { color: #28a745; font-size: 1.5rem; margin-bottom: 1rem; }
            </style>
        </head>
        <body>
          <div class="card">
            <div class="success">✓ Etsy Connection Successful!</div>
            <p>Your shop has been linked successfully.</p>
            <p>You can close this window now.</p>
          </div>
        </body>
      </html>
    `)
  }
}
