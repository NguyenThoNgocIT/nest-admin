import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('woocommerce_order_refunds')
export class WooCommerceOrderRefundEntity {
  @PrimaryColumn()
  id: number

  @Column()
  store_id: number

  @Column()
  order_id: number

  @Column({ type: 'timestamp' })
  date_created: Date

  @Column({ type: 'timestamp', nullable: true })
  date_created_gmt: Date

  @Column()
  amount: string

  @Column({ nullable: true })
  reason: string

  @Column()
  refunded_by: number

  @Column({ default: false })
  refunded_payment: boolean

  @Column({ type: 'json', nullable: true })
  meta_data: any[]

  @Column({ type: 'json', nullable: true })
  line_items: any[]

  @Column({ type: 'json', nullable: true })
  tax_lines: any[]

  @Column({ type: 'json', nullable: true })
  shipping_lines: any[]

  @Column({ type: 'json', nullable: true })
  fee_lines: any[]

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date
}
