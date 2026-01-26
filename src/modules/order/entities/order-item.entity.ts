import { Column, Entity } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

@Entity('order_items')
export class OrderItemEntity extends CommonEntity {
  @Column()
  orderId: number // FK -> orders.id

  @Column({ nullable: true })
  productId: number // FK -> products.id (nếu map được)

  @Column({ nullable: true })
  productVariantId: number // FK -> product_variants.id

  @Column({ length: 255 })
  name: string // tên hiển thị (Shopify: lineItem.name)

  @Column({ length: 64, nullable: true })
  sku: string

  @Column({ type: 'int' })
  quantity: number

  @Column({ type: 'decimal', precision: 16, scale: 4 })
  unitPrice: string // giá 1 đơn vị (trước discount), chuẩn hoá

  @Column({ type: 'decimal', precision: 16, scale: 4, default: 0 })
  totalPrice: string // giá sau discount * quantity

  @Column({ type: 'decimal', precision: 16, scale: 4, default: 0 })
  discountAmount: string

  @Column({ type: 'decimal', precision: 16, scale: 4, default: 0 })
  taxAmount: string

  @Column({ length: 32, nullable: true })
  fulfillmentStatus: string // nếu muốn track per line item

  @Column({ type: 'json', nullable: true })
  rawData: any // raw line_item từ kênh
}
