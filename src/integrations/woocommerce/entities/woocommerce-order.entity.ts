import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('woocommerce_orders')
export class WooCommerceOrderEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  storeId: number

  @Column()
  wcId: number // WooCommerce Order ID

  @Column()
  number: string

  @Column()
  status: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number

  @Column()
  currency: string

  @Column({ type: 'json', nullable: true })
  rawData: any // Store full JSON response
}
