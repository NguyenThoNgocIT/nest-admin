import { Column, Entity } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

@Entity('channel_product_mappings')
export class ChannelProductMappingEntity extends CommonEntity {
  @Column()
  productId: number // FK -> products.id (nội bộ)

  @Column()
  storeId: number // FK -> stores.id (kênh cụ thể; Shopify/Shopee/Lazada shop nào)

  @Column()
  channelCode: string // 'shopify' | 'shopee' | 'lazada' | ...

  @Column()
  externalProductId: string // Shopify: product.id (gid), Shopee: item_id, ...

  @Column({ nullable: true })
  externalProductHandle: string // Shopify: handle, Shopee: alias,...

  @Column({ nullable: true })
  externalProductUrl: string // URL product trên kênh (để user click mở nhanh)

  @Column({ type: 'json', nullable: true })
  extraData: any // nơi lưu gì đó đặc thù: collection IDs trên Shopify, category_id trên Shopee/Lazada,...
}
