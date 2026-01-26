import { Column, Entity } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

@Entity('channel_orders')
export class ChannelOrderEntity extends CommonEntity {
  @Column()
  orderId: number // FK -> orders.id (nội bộ)

  @Column()
  storeId: number // FK -> stores.id (kênh cụ thể)

  @Column()
  channelCode: string // 'shopify', 'shopee', ...

  @Column()
  externalOrderId: string // Shopify: order.id (gid) hoặc numeric id; Shopee: order_sn,...

  @Column({ nullable: true })
  externalOrderNumber: string // Shopify: name (#1001), Shopee: mã hiển thị,...

  @Column({ type: 'json', nullable: true })
  extraData: any // chỗ để lưu thông tin đặc thù kênh: fulfillmentOrderIds, transactionIds, ...
}
