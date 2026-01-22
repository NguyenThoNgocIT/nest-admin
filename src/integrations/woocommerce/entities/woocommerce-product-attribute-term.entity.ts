import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity('woocommerce_product_attribute_terms')
export class WooCommerceProductAttributeTermEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Index()
  @Column()
  store_id: number

  @Index()
  @Column()
  attribute_id: number // The WooCommerce Attribute ID this term belongs to

  @Index()
  @Column()
  term_id: number // WooCommerce Term ID

  @Column()
  name: string

  @Column()
  slug: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ default: 0 })
  menu_order: number

  @Column({ default: 0 })
  count: number
}
