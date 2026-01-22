import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('woocommerce_shipping_zone_locations')
export class WooCommerceShippingZoneLocationEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  store_id: number

  @Column()
  zone_id: number

  @Column()
  code: string

  @Column()
  type: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date
}
