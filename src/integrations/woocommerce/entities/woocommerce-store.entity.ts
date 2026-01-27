import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('woocommerce_stores')
export class WooCommerceStoreEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  name: string// Liên kết với user trong hệ thống

  @Column({ nullable: false })
  url: string// e.g. https://yourstore.com

  @Column({ nullable: false })
  consumerKey: string

  @Column({ nullable: false })
  consumerSecret: string

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
