// src/integrations/ebay/entities/ebay-store.entity.ts

import { BaseEntity, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('ebay_stores')
@Index(['userId', 'ebayUserId'], { unique: true }) // ← Ngăn duplicate
export class EbayStoreEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'user_id', nullable: true })
  @Index()
  userId: number // Liên kết với UserEntity của hệ thống nest-admin

  @Column({ name: 'ebay_user_id', nullable: false })
  @Index()
  ebayUserId: string // ← Lấy từ /identity/v1/user/info (BẮT BUỘC)

  @Column({ nullable: true })
  username: string // ← eBay username (optional, for display)

  @Column({ name: 'marketplace_id', type: 'varchar', length: 10, default: 'EBAY_US' })
  marketplaceId: string // ← EBAY_US, EBAY_UK... (BẮT BUỘC)

  @Column({ name: 'access_token', type: 'text', nullable: false })
  accessToken: string

  @Column({ name: 'refresh_token', type: 'text', nullable: false })
  refreshToken: string

  @Column({ name: 'token_expires_at', type: 'datetime', nullable: false })
  tokenExpiresAt: Date

  @Column({ type: 'simple-array', nullable: true })
  scopes: string[] // ← Lưu scopes đã được cấp

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: 'active' | 'disconnected' | 'revoked'

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
