import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity('woocommerce_product_categories')
export class WooCommerceProductCategoryEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Index()
  @Column()
  store_id: number

  @Index()
  @Column()
  category_id: number // WooCommerce Category ID

  @Column()
  name: string

  @Column()
  slug: string

  @Column({ default: 0 })
  parent: number

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ default: 'default' })
  display: string

  @Column({ type: 'simple-json', nullable: true })
  image: {
    id: number
    date_created: string
    date_created_gmt: string
    date_modified: string
    date_modified_gmt: string
    src: string
    name: string
    alt: string
  }

  @Column({ default: 0 })
  menu_order: number

  @Column({ default: 0 })
  count: number
}
