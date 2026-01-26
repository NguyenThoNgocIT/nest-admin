import { Column, Entity } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

@Entity('channel_order_items')
export class ChannelOrderItemEntity extends CommonEntity {
  @Column()
  orderItemId: number // FK -> order_items.id

  @Column()
  channelCode: string

  @Column()
  externalLineItemId: string // Shopify: lineItem.id (gid), Shopee: order_item_id...

  @Column({ type: 'json', nullable: true })
  extraData: any
}
