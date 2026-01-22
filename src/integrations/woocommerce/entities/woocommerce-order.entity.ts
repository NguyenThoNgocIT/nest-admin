import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('woocommerce_orders')
export class WooCommerceOrderEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  storeId: number

  @Column()
  wcId: number // WooCommerce Order ID

  @Column()
  number: string

  @Column()
  orderKey: string

  @Column({ default: 'pending' })
  status: string

  @Column()
  currency: string

  @Column({ nullable: true })
  dateCreated: Date

  @Column({ nullable: true })
  dateModified: Date

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountTotal: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountTax: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  shippingTotal: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  shippingTax: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cartTax: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalTax: number

  @Column({ type: 'boolean', default: false })
  pricesIncludeTax: boolean

  @Column({ nullable: true })
  customerId: number

  @Column({ nullable: true })
  customerIpAddress: string

  @Column({ nullable: true })
  customerUserAgent: string

  @Column({ type: 'text', nullable: true })
  customerNote: string

  @Column('simple-json', { nullable: true })
  billing: any

  @Column('simple-json', { nullable: true })
  shipping: any

  @Column({ nullable: true })
  paymentMethod: string

  @Column({ nullable: true })
  paymentMethodTitle: string

  @Column({ nullable: true })
  transactionId: string

  @Column({ nullable: true })
  datePaid: Date

  @Column({ nullable: true })
  dateCompleted: Date

  @Column({ nullable: true })
  cartHash: string

  @Column('simple-json', { nullable: true })
  lineItems: any[]

  @Column('simple-json', { nullable: true })
  taxLines: any[]

  @Column('simple-json', { nullable: true })
  shippingLines: any[]

  @Column('simple-json', { nullable: true })
  feeLines: any[]

  @Column('simple-json', { nullable: true })
  couponLines: any[]

  @Column('simple-json', { nullable: true })
  refunds: any[]

  @Column('simple-json', { nullable: true })
  metaData: any

  @Column('simple-json', { nullable: true })
  rawData: any

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
