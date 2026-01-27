import { Column, Entity } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

@Entity('product_variants')
export class ProductVariantEntity extends CommonEntity {
  @Column()
  productId: number // FK -> products.id

  @Column({ length: 255 })
  name: string // 'Size M / Đỏ'

  @Column({ length: 64, nullable: true })
  sku: string

  @Column({ length: 64, nullable: true })
  barcode: string

  @Column({ type: 'decimal', precision: 16, scale: 4, nullable: true })
  price: string // giá chuẩn hoá nội bộ (base price)

  @Column({ type: 'decimal', precision: 16, scale: 4, nullable: true })
  compareAtPrice: string

  @Column({ default: true })
  isActive: boolean

  @Column({ default: false })
  isDefault: boolean // nếu bạn muốn đánh dấu variant chính

  @Column({ type: 'json', nullable: true })
  optionValues: any
  // Ví dụ:
  // { size: 'M', color: 'Red' }
  // hoặc [{name: 'Size', value: 'M'}, {name: 'Color', value: 'Red'}]

  @Column({ nullable: true })
  imageUrl: string
}
