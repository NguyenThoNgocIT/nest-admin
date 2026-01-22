import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('woocommerce_tax_rates')
export class WooCommerceTaxRateEntity {
  @PrimaryColumn()
  id: number

  @Column()
  store_id: number

  @Column({ length: 2 })
  country: string

  @Column()
  state: string

  @Column({ nullable: true })
  postcode: string

  @Column({ nullable: true })
  city: string

  @Column('simple-array', { nullable: true })
  postcodes: string[]

  @Column('simple-array', { nullable: true })
  cities: string[]

  @Column()
  rate: string

  @Column()
  name: string

  @Column({ default: 1 })
  priority: number

  @Column({ default: false })
  compound: boolean

  @Column({ default: true })
  shipping: boolean

  @Column({ default: 0 })
  order: number

  @Column({ default: 'standard' })
  class: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date
}
