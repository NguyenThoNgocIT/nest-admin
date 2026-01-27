import { Column, Entity } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

@Entity('products')
export class ProductEntity extends CommonEntity {
  @Column()
  merchantId: number // FK -> merchants.id

  @Column({ length: 255 })
  name: string // tên chuẩn hoá nội bộ

  @Column({ length: 255, nullable: true })
  handle: string // slug nội bộ (tuỳ bạn)

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ length: 64, nullable: true })
  productType: string // 'T-Shirt', 'Shoes', ...

  @Column({ length: 64, nullable: true })
  vendor: string

  @Column({ type: 'simple-array', nullable: true })
  tags: string[] // ['summer', 'sale'],...

  @Column({ default: true })
  isActive: boolean

  @Column({ default: false })
  isArchived: boolean

  @Column({ nullable: true })
  mainImageUrl: string // ảnh đại diện nội bộ

  @Column({ type: 'json', nullable: true })
  images: any // list ảnh, hoặc bạn tách bảng riêng nếu muốn

  @Column({ type: 'datetime', nullable: true })
  createdAtChannel: Date // ngày đầu tiên xuất hiện trên 1 kênh (optional)
}
