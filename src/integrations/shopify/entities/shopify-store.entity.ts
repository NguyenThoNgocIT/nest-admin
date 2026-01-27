import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('shopify_stores')
export class ShopifyStoreEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  shopDomain: string

  @Column({ nullable: true })
  accessToken: string

  @Column({ nullable: true })
  scopes: string

  @Column({ nullable: true })
  state: string // Dùng để verify OAuth callback

  @Column({ default: true })
  isActive: boolean

  @Column({ nullable: true })
  shopName: string

  @Column({ name: 'user_id', nullable: true })
  userId: number

  @Column({ nullable: true })
  email: string

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date
}
