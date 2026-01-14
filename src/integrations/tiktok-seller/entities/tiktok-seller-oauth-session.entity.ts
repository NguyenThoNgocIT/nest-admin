import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'

@Entity('tiktok_seller_oauth_sessions')
export class TikTokSellerOAuthSessionEntity {
  @PrimaryColumn()
  state: string // Random UUID dùng để chống giả mạo request (CSRF Protection)

  @Column({ nullable: false })
  merchantId: number // User ID thực hiện request

  @Column({ type: 'timestamp', nullable: false })
  expiresAt: Date // Thời gian hết hạn (TTL 10 phút)

  @CreateDateColumn()
  createdAt: Date
}
