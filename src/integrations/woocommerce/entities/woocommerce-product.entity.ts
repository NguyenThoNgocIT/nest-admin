import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity('woocommerce_products')
export class WooCommerceProductEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Index()
  @Column()
  storeId: number

  @Index()
  @Column()
  wcId: number // WooCommerce Product ID

  @Column()
  name: string

  @Column({ nullable: true })
  slug: string

  @Column({ nullable: true })
  permalink: string

  @Column({ type: 'timestamp', nullable: true })
  date_created: Date

  @Column({ type: 'timestamp', nullable: true })
  date_modified: Date

  @Column({ default: 'simple' })
  type: string

  @Column({ default: 'publish' })
  status: string

  @Column({ default: false })
  featured: boolean

  @Column({ default: 'visible' })
  catalog_visibility: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ type: 'text', nullable: true })
  short_description: string

  @Column({ nullable: true })
  sku: string

  @Column({ nullable: true })
  price: string

  @Column({ nullable: true })
  regular_price: string

  @Column({ nullable: true })
  sale_price: string

  @Column({ default: false })
  on_sale: boolean

  @Column({ default: true })
  purchasable: boolean

  @Column({ default: 0 })
  total_sales: number

  @Column({ default: false })
  virtual: boolean

  @Column({ default: false })
  downloadable: boolean

  @Column({ default: 'taxable' })
  tax_status: string

  @Column({ nullable: true })
  tax_class: string

  @Column({ default: false })
  manage_stock: boolean

  @Column({ nullable: true })
  stock_quantity: number

  @Column({ default: 'instock' })
  stock_status: string

  @Column({ default: 'no' })
  backorders: string

  @Column({ nullable: true })
  weight: string

  @Column({ type: 'json', nullable: true })
  dimensions: any

  @Column({ default: true })
  reviews_allowed: boolean

  @Column({ nullable: true })
  average_rating: string

  @Column({ default: 0 })
  rating_count: number

  @Column({ type: 'simple-array', nullable: true })
  related_ids: number[]

  @Column({ type: 'simple-array', nullable: true })
  upsell_ids: number[]

  @Column({ type: 'simple-array', nullable: true })
  cross_sell_ids: number[]

  @Column({ default: 0 })
  parent_id: number

  @Column({ type: 'json', nullable: true })
  categories: any[]

  @Column({ type: 'json', nullable: true })
  tags: any[]

  @Column({ type: 'json', nullable: true })
  images: any[]

  @Column({ type: 'json', nullable: true })
  attributes: any[]

  @Column({ type: 'json', nullable: true })
  default_attributes: any[]

  @Column({ type: 'simple-array', nullable: true })
  variations: number[]

  @Column({ type: 'simple-array', nullable: true })
  grouped_products: number[]

  @Column({ default: 0 })
  menu_order: number

  @Column({ type: 'json', nullable: true })
  meta_data: any[]

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date
}
