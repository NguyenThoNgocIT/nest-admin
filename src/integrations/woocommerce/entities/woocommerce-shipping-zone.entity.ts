import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('woocommerce_shipping_zones')
export class WooCommerceShippingZoneEntity {
  @PrimaryColumn()
  id: number

  @PrimaryColumn()
  store_id: number

  @Column()
  name: string

  @Column({ default: 0 })
  order: number

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date
}
