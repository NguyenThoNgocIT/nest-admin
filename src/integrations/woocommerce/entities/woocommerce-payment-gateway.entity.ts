import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('woocommerce_payment_gateways')
export class WooCommercePaymentGatewayEntity {
  @PrimaryColumn()
  id: string

  @PrimaryColumn()
  store_id: number

  @Column()
  title: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ default: 0 })
  order: number

  @Column({ default: false })
  enabled: boolean

  @Column()
  method_title: string

  @Column({ type: 'text' })
  method_description: string

  @Column({ type: 'json', nullable: true })
  method_supports: string[]

  @Column({ type: 'json', nullable: true })
  settings: any

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date
}
