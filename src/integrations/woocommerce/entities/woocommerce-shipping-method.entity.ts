import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('woocommerce_shipping_methods')
export class WooCommerceShippingMethodEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  store_id: number

  @Column()
  method_id: string

  @Column()
  title: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date
}
