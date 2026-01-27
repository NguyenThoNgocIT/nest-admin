import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('woocommerce_webhooks')
export class WooCommerceWebhookEntity {
  @PrimaryColumn()
  id: number

  @Column()
  store_id: number

  @Column()
  name: string

  @Column()
  status: string

  @Column()
  topic: string

  @Column()
  resource: string

  @Column()
  event: string

  @Column({ type: 'json', nullable: true })
  hooks: string[]

  @Column()
  delivery_url: string

  @Column({ nullable: true })
  secret: string

  @Column({ type: 'timestamp', nullable: true })
  date_created: Date

  @Column({ type: 'timestamp', nullable: true })
  date_created_gmt: Date

  @Column({ type: 'timestamp', nullable: true })
  date_modified: Date

  @Column({ type: 'timestamp', nullable: true })
  date_modified_gmt: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date
}
