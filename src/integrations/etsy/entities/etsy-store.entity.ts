import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('etsy_stores')
export class EtsyStoreEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  // ID của user trong hệ thống của chúng ta
  @Column({ name: 'user_id', nullable: true })
  userId: number

  // Etsy Shop ID (API trả về)
  @Column({ name: 'etsy_shop_id', unique: true })
  etsyShopId: string

  // Etsy Shop Name
  @Column({ name: 'shop_name', nullable: true })
  shopName: string

  // User ID của tài khoản Etsy (lấy từ /users/__SELF__)
  @Column({ name: 'etsy_user_id', nullable: true })
  etsyUserId: string

  @Column({ name: 'access_token', type: 'text' })
  accessToken: string

  @Column({ name: 'refresh_token', type: 'text' })
  refreshToken: string

  // Thời gian token hết hạn (epoch milliseconds)
  @Column({ name: 'token_expires_at', type: 'bigint' })
  tokenExpiresAt: number

  @Column({ nullable: true })
  scopes: string

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
