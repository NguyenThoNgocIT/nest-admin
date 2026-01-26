import { Column, Entity } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

@Entity('stores')
export class StoreEntity extends CommonEntity {
  @Column()
  merchantId: number // FK -> merchants.id

  @Column()
  channelId: number // FK -> channels.id

  @Column()
  externalStoreId: string // Shopify: shopDomain, Shopee: shop_id, v.v.

  @Column()
  name: string // tên hiển thị

  @Column({ default: true })
  isActive: boolean

  @Column({ type: 'json', nullable: true })
  config: any // token, refresh_token, extra config theo kênh (mã hóa, etc.)
}
