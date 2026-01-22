import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity('woocommerce_product_attributes')
export class WooCommerceProductAttributeEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Index()
  @Column()
  store_id: number

  @Index()
  @Column()
  attribute_id: number // WooCommerce Attribute ID

  @Column()
  name: string

  @Column()
  slug: string

  @Column({ default: 'select' })
  type: string

  @Column({ default: 'menu_order' })
  order_by: string

  @Column({ default: false })
  has_archives: boolean

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date
}
