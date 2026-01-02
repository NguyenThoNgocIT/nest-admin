import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('woocommerce_products')
export class WooCommerceProductEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  storeId: number

  @Column()
  wcId: number // WooCommerce Product ID

  @Column()
  name: string

  @Column({ nullable: true })
  sku: string

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number

  @Column({ nullable: true })
  status: string

  @Column({ type: 'json', nullable: true })
  rawData: any // Store full JSON response
}
