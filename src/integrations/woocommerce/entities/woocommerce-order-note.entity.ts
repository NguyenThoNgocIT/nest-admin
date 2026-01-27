import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('woocommerce_order_notes')
export class WooCommerceOrderNoteEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  storeId: number

  @Column()
  orderId: number

  @Column()
  noteId: number

  @Column()
  author: string

  @Column({ type: 'text' })
  note: string

  @Column({ type: 'boolean', default: false })
  customerNote: boolean

  @Column({ type: 'boolean', default: false })
  addedByUser: boolean

  @Column({ nullable: true })
  dateCreated: Date

  @CreateDateColumn()
  createdAt: Date
}
