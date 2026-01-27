import { Column, Entity } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

@Entity('orders')
export class OrderEntity extends CommonEntity {
  @Column()
  merchantId: number // FK -> merchants.id

  @Column()
  storeId: number // FK -> stores.id (biết đơn này thuộc store nào của merchant)

  @Column({ length: 64 })
  channelCode: string // 'shopify' | 'shopee' | ...

  @Column({ length: 128 })
  channelOrderNumber: string // số đơn hiển thị cho merchant (Shopify: order.name, Shopee: order_sn,...)

  @Column({ nullable: true })
  customerId: number // FK -> customers table (nếu có module customers nội bộ)

  @Column({ type: 'decimal', precision: 16, scale: 4 })
  totalAmount: string // tổng tiền đã chuẩn hoá về đơn vị tiền tệ chính (VD: VND)

  @Column({ type: 'varchar', length: 3 })
  currency: string // 'USD', 'VND', 'SGD', ...

  @Column({ type: 'decimal', precision: 16, scale: 4, default: 0 })
  subtotalAmount: string

  @Column({ type: 'decimal', precision: 16, scale: 4, default: 0 })
  shippingAmount: string

  @Column({ type: 'decimal', precision: 16, scale: 4, default: 0 })
  taxAmount: string

  @Column({ type: 'decimal', precision: 16, scale: 4, default: 0 })
  discountAmount: string

  @Column({ length: 32 })
  financialStatus: string // nội bộ: 'paid' | 'unpaid' | 'refunded' | 'partial_refunded' | ...

  @Column({ length: 32 })
  fulfillmentStatus: string // nội bộ: 'unfulfilled' | 'partial' | 'fulfilled' | 'cancelled'

  @Column({ length: 32, default: 'open' })
  status: string // nội bộ: 'open' | 'closed' | 'cancelled'...

  @Column({ type: 'datetime' })
  placedAt: Date // thời gian khách đặt (Shopify: createdAt)

  @Column({ type: 'datetime', nullable: true })
  processedAt: Date // nếu bạn muốn dùng processedAt

  @Column({ type: 'datetime', nullable: true })
  closedAt: Date

  @Column({ type: 'varchar', length: 2, nullable: true })
  customerCountryCode: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  customerName: string
}
