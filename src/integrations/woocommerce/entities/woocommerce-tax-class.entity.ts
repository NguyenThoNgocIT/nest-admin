import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('woocommerce_tax_classes')
export class WooCommerceTaxClassEntity {
  @PrimaryColumn()
  store_id: number

  @PrimaryColumn()
  slug: string

  @Column()
  name: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date
}
