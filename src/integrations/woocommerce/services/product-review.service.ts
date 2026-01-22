import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import {
  BatchProductReviewDto,
  CreateProductReviewDto,
  UpdateProductReviewDto,
} from '../dto/product-review.dto'
import { WooCommerceProductReviewEntity } from '../entities/woocommerce-product-review.entity'
import { WooCommerceClientService } from '../services/woocommerce-client.service'

@Injectable()
export class ProductReviewService {
  private readonly logger = new Logger(ProductReviewService.name)

  constructor(
    @InjectRepository(WooCommerceProductReviewEntity)
    private readonly reviewRepository: Repository<WooCommerceProductReviewEntity>,
    private readonly wooCommerceClientService: WooCommerceClientService,
  ) {}

  async create(storeId: number, data: CreateProductReviewDto) {
    const client = await this.wooCommerceClientService.getClient(storeId)
    const response = await client.post('products/reviews', data)
    await this.saveReview(storeId, response.data)
    return response.data
  }

  async retrieve(storeId: number, reviewId: number) {
    const client = await this.wooCommerceClientService.getClient(storeId)
    const response = await client.get(`products/reviews/${reviewId}`)
    await this.saveReview(storeId, response.data)
    return response.data
  }

  async list(storeId: number, params: any = {}) {
    const client = await this.wooCommerceClientService.getClient(storeId)
    const response = await client.get('products/reviews', params)

    if (Array.isArray(response.data)) {
      for (const review of response.data) {
        await this.saveReview(storeId, review)
      }
    }

    return response.data
  }

  async update(
    storeId: number,
    reviewId: number,
    data: UpdateProductReviewDto,
  ) {
    const client = await this.wooCommerceClientService.getClient(storeId)
    const response = await client.put(`products/reviews/${reviewId}`, data)
    await this.saveReview(storeId, response.data)
    return response.data
  }

  async delete(storeId: number, reviewId: number, force = true) {
    const client = await this.wooCommerceClientService.getClient(storeId)
    const response = await client.delete(`products/reviews/${reviewId}`, {
      force,
    })
    await this.reviewRepository.delete({ store_id: storeId, review_id: reviewId })
    return response.data
  }

  async batch(storeId: number, data: BatchProductReviewDto) {
    const client = await this.wooCommerceClientService.getClient(storeId)
    const response = await client.post('products/reviews/batch', data)

    if (response.data.create) {
      for (const review of response.data.create) {
        await this.saveReview(storeId, review)
      }
    }
    if (response.data.update) {
      for (const review of response.data.update) {
        await this.saveReview(storeId, review)
      }
    }
    if (response.data.delete) {
      for (const review of response.data.delete) {
        if (review.previous) {
          // If delete returns the object, it usually has "previous" key with content or similar
          await this.reviewRepository.delete({
            store_id: storeId,
            review_id: review.previous.id,
          })
        }
        else {
          await this.reviewRepository.delete({
            store_id: storeId,
            review_id: review.id,
          })
        }
      }
    }

    return response.data
  }

  private async saveReview(storeId: number, reviewData: any) {
    const existing = await this.reviewRepository.findOne({
      where: { store_id: storeId, review_id: reviewData.id },
    })

    const entity = existing || new WooCommerceProductReviewEntity()
    entity.store_id = storeId
    entity.review_id = reviewData.id
    entity.date_created = reviewData.date_created
    entity.date_created_gmt = reviewData.date_created_gmt
    entity.product_id = reviewData.product_id
    entity.status = reviewData.status
    entity.reviewer = reviewData.reviewer
    entity.reviewer_email = reviewData.reviewer_email
    entity.review = reviewData.review
    entity.rating = reviewData.rating
    entity.verified = reviewData.verified
    entity.reviewer_avatar_urls = reviewData.reviewer_avatar_urls

    return this.reviewRepository.save(entity)
  }
}
