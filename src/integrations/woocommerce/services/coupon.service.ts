import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateCouponDto, UpdateCouponDto } from '../dto/create-coupon.dto'
import { WooCommerceCouponEntity } from '../entities/woocommerce-coupon.entity'
import { WooCommerceClientService } from './woocommerce-client.service'

@Injectable()
export class CouponService {
  constructor(
    private readonly clientService: WooCommerceClientService,
    @InjectRepository(WooCommerceCouponEntity)
    private readonly couponRepository: Repository<WooCommerceCouponEntity>,
  ) {}

  async createCoupon(storeId: number, data: CreateCouponDto) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.post('coupons', data)
    return response.data
  }

  async getCoupons(storeId: number, params?: any) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.get('coupons', params)
    return response.data
  }

  async getCoupon(storeId: number, couponId: number) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.get(`coupons/${couponId}`)
    return response.data
  }

  async updateCoupon(storeId: number, couponId: number, data: UpdateCouponDto) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.put(`coupons/${couponId}`, data)
    return response.data
  }

  async deleteCoupon(storeId: number, couponId: number, force = false) {
    const client = await this.clientService.getClient(storeId)
    const response = await client.delete(`coupons/${couponId}`, { force })
    return response.data
  }

  async syncCoupons(storeId: number) {
    // Fetch all coupons (using basic pagination logic for demo, can be improved)
    const coupons = await this.getCoupons(storeId, { per_page: 100 })
    const savedCoupons = []

    for (const c of coupons) {
      let entity = await this.couponRepository.findOne({ where: { storeId, wcId: c.id } })
      if (!entity) {
        entity = new WooCommerceCouponEntity()
        entity.storeId = storeId
        entity.wcId = c.id
      }

      entity.code = c.code
      entity.amount = c.amount ? Number.parseFloat(c.amount) : 0
      entity.discountType = c.discount_type
      entity.description = c.description
      entity.dateExpires = c.date_expires ? new Date(c.date_expires) : null
      entity.usageCount = c.usage_count
      entity.individualUse = c.individual_use
      entity.productIds = c.product_ids || []
      entity.excludedProductIds = c.excluded_product_ids || []
      entity.usageLimit = c.usage_limit
      entity.usageLimitPerUser = c.usage_limit_per_user
      entity.limitUsageToXItems = c.limit_usage_to_x_items
      entity.freeShipping = c.free_shipping
      entity.productCategories = c.product_categories || []
      entity.excludedProductCategories = c.excluded_product_categories || []
      entity.excludeSaleItems = c.exclude_sale_items
      entity.minimumAmount = c.minimum_amount ? Number.parseFloat(c.minimum_amount) : 0
      entity.maximumAmount = c.maximum_amount ? Number.parseFloat(c.maximum_amount) : 0
      entity.emailRestrictions = c.email_restrictions || []
      entity.metaData = c.meta_data
      entity.rawData = c

      savedCoupons.push(await this.couponRepository.save(entity))
    }
    return savedCoupons
  }
}
