import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('woocommerce_customers')
export class WooCommerceCustomerEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  storeId: number

  @Column()
  wcId: number // WooCommerce Customer ID

  @Column()
  email: string

  @Column({ nullable: true })
  firstName: string

  @Column({ nullable: true })
  lastName: string

  @Column({ nullable: true })
  username: string

  @Column({ nullable: true })
  role: string

  @Column('simple-json', { nullable: true })
  billing: any

  @Column('simple-json', { nullable: true })
  shipping: any

  @Column({ type: 'boolean', default: false })
  isPayingCustomer: boolean

  @Column({ nullable: true })
  avatarUrl: string

  @Column('simple-json', { nullable: true })
  metaData: any

  @Column('simple-json', { nullable: true })
  rawData: any

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
