import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('woocommerce_coupons')
export class WooCommerceCouponEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  storeId: number

  @Column()
  wcId: number // WooCommerce Coupon ID

  @Column()
  code: string

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number

  @Column()
  discountType: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ nullable: true })
  dateExpires: Date

  @Column({ default: 0 })
  usageCount: number

  @Column({ type: 'boolean', default: false })
  individualUse: boolean

  @Column('simple-array', { nullable: true })
  productIds: number[]

  @Column('simple-array', { nullable: true })
  excludedProductIds: number[]

  @Column({ nullable: true })
  usageLimit: number

  @Column({ nullable: true })
  usageLimitPerUser: number

  @Column({ nullable: true })
  limitUsageToXItems: number

  @Column({ type: 'boolean', default: false })
  freeShipping: boolean

  @Column('simple-array', { nullable: true })
  productCategories: number[]

  @Column('simple-array', { nullable: true })
  excludedProductCategories: number[]

  @Column({ type: 'boolean', default: false })
  excludeSaleItems: boolean

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  minimumAmount: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  maximumAmount: number

  @Column('simple-array', { nullable: true })
  emailRestrictions: string[]

  @Column('simple-json', { nullable: true })
  metaData: any

  @Column('simple-json', { nullable: true })
  rawData: any

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
