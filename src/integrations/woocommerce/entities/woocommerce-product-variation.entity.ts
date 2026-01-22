import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity('woocommerce_product_variations')
export class WooCommerceProductVariationEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Index()
  @Column()
  store_id: number

  @Index()
  @Column()
  product_id: number // Parent Product Class ID

  @Index()
  @Column()
  variation_id: number // WooCommerce Variation ID

  @Column({ type: 'timestamp', nullable: true })
  date_created: Date

  @Column({ type: 'timestamp', nullable: true })
  date_modified: Date

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ nullable: true })
  permalink: string

  @Column({ nullable: true })
  sku: string

  @Column({ nullable: true })
  price: string

  @Column({ nullable: true })
  regular_price: string

  @Column({ nullable: true })
  sale_price: string

  @Column({ nullable: true })
  date_on_sale_from: Date

  @Column({ nullable: true })
  date_on_sale_to: Date

  @Column({ default: false })
  on_sale: boolean

  @Column({ default: 'publish' })
  status: string

  @Column({ default: true })
  purchasable: boolean

  @Column({ default: false })
  virtual: boolean

  @Column({ default: false })
  downloadable: boolean

  @Column({ type: 'jsonb', nullable: true })
  downloads: any[]

  @Column({ default: -1 })
  download_limit: number

  @Column({ default: -1 })
  download_expiry: number

  @Column({ default: 'taxable' })
  tax_status: string

  @Column({ nullable: true })
  tax_class: string

  @Column({ default: false })
  manage_stock: boolean // Can be boolean or 'parent' in docs, but usually boolean in API response for variation specific

  @Column({ nullable: true })
  stock_quantity: number

  @Column({ default: 'instock' })
  stock_status: string

  @Column({ default: 'no' })
  backorders: string

  @Column({ default: false })
  backorders_allowed: boolean

  @Column({ default: false })
  backordered: boolean

  @Column({ nullable: true })
  weight: string

  @Column({ type: 'jsonb', nullable: true })
  dimensions: any

  @Column({ nullable: true })
  shipping_class: string

  @Column({ default: 0 })
  shipping_class_id: number

  @Column({ type: 'jsonb', nullable: true })
  image: any

  @Column({ type: 'jsonb', nullable: true })
  attributes: any[]

  @Column({ default: 0 })
  menu_order: number

  @Column({ type: 'jsonb', nullable: true })
  meta_data: any[]

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date
}
