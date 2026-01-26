import { Column, Entity } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

@Entity('channels')
export class ChannelEntity extends CommonEntity {
  @Column({ unique: true })
  code: string // 'shopify', 'shopee', 'lazada', ...

  @Column()
  name: string // 'Shopify', 'Shopee', 'Lazada', ...

  @Column({ default: true })
  isActive: boolean
}
