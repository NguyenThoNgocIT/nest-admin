import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('woocommerce_setting_groups')
export class WooCommerceSettingGroupEntity {
  @PrimaryColumn()
  id: string

  @PrimaryColumn()
  store_id: number

  @Column()
  label: string

  @Column()
  description: string

  @Column()
  parent_id: string

  @Column({ type: 'json', nullable: true })
  sub_groups: string[]

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date
}
