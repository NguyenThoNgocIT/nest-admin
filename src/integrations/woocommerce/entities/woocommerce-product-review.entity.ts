import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity('woocommerce_product_reviews')
export class WooCommerceProductReviewEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Index()
  @Column()
  store_id: number

  @Index()
  @Column()
  review_id: number // WooCommerce Review ID

  @Column()
  date_created: string

  @Column()
  date_created_gmt: string

  @Index()
  @Column()
  product_id: number

  @Column({ default: 'approved' })
  status: string

  @Column()
  reviewer: string

  @Column()
  reviewer_email: string

  @Column({ type: 'text' })
  review: string

  @Column()
  rating: number

  @Column({ default: false })
  verified: boolean

  @Column({ type: 'simple-json', nullable: true })
  reviewer_avatar_urls: any
}
