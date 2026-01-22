import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('woocommerce_setting_options')
export class WooCommerceSettingOptionEntity {
  @PrimaryColumn()
  id: string

  @PrimaryColumn()
  store_id: number

  @Column()
  group_id: string

  @Column()
  label: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ type: 'text', nullable: true }) // Value can be mixed, storing as string/json
  value: string

  @Column({ type: 'text', nullable: true })
  default: string

  @Column({ nullable: true })
  tip: string

  @Column({ nullable: true })
  placeholder: string

  @Column()
  type: string

  @Column({ type: 'json', nullable: true })
  options: any // Key-value pairs for select/radio

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date
}
