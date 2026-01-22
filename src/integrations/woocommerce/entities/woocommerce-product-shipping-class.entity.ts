import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity('woocommerce_product_shipping_classes')
export class WooCommerceProductShippingClassEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Index()
  @Column()
  store_id: number

  @Index()
  @Column()
  shipping_class_id: number // WooCommerce Shipping Class ID

  @Column()
  name: string

  @Column()
  slug: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ default: 0 })
  count: number
}
