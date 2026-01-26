import { Column, Entity } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

@Entity('channel_variant_mappings')
export class ChannelVariantMappingEntity extends CommonEntity {
  @Column()
  productVariantId: number // FK -> product_variants.id

  @Column()
  storeId: number // FK -> stores.id

  @Column()
  channelCode: string

  @Column()
  externalVariantId: string
  // Shopify: productVariant.id (gid)
  // Shopee: variation_id (nếu có)
  // Lazada: sku_id hoặc tương đương

  @Column({ nullable: true })
  externalSku: string // SKU trên kênh (thường trùng sku nội bộ, nhưng không phải lúc nào cũng vậy)

  @Column({ type: 'json', nullable: true })
  extraData: any // locationId, inventoryItemId (Shopify),...
}
