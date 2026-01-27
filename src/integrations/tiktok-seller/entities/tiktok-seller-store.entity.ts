import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('tiktok_seller_stores')
@Index(['merchantId', 'shopId'], { unique: true }) // Multi-store safety: Một user (merchant) có thể quản lý shop này
// @Index(['shopId'], { unique: true }) // REMOVE TO FIX DUPLICATE INDEX ERROR - shopId already has @Index() below and unique handled by first index
export class TikTokSellerStoreEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: false })
  @Index()
  merchantId: number // User ID trong hệ thống Admin (đổi về number cho khớp với User Entity của Nest Admin)

  // ✅ TikTok Shop identifiers (TRẢ TRỰC TIẾP trong token response)
  @Column({ nullable: false, unique: true }) // Add unique: true here instead of separate decorator
  // @Index() // REMOVE DUPLICATE INDEX DECORATOR
  shopId: string // TikTok shop_id (numeric string)

  @Column({ nullable: false })
  openId: string // Seller account identifier (unique per seller)

  @Column({ nullable: true })
  shopName: string // Tên cửa hàng để hiển thị

  @Column({ type: 'varchar', length: 10, nullable: true })
  sellerRegion: string // VN, US, UK, etc. (từ seller_base_region)

  // OAuth tokens
  @Column({ type: 'text', nullable: false })
  accessToken: string

  @Column({ type: 'text', nullable: false })
  refreshToken: string

  @Column({ type: 'timestamp', nullable: false })
  tokenExpiresAt: Date // access_token hết hạn sau 7 ngày

  // ⚠️ refresh_token không có expiry cố định, nhưng có thể bị revoke
  // Không lưu refreshTokenExpiresAt vì TikTok không trả về field này cụ thể

  @Column({ type: 'simple-array', nullable: true })
  grantedScopes: string[] // Danh sách quyền được cấp (nếu TikTok trả về)

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: 'active' | 'disconnected' | 'revoked'

  @CreateDateColumn()
  connectedAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
