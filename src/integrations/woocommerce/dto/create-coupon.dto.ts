export class CreateCouponDto {
  code: string
  discount_type?: 'percent' | 'fixed_cart' | 'fixed_product'
  amount?: string
  description?: string
  date_expires?: string
  individual_use?: boolean
  product_ids?: number[]
  excluded_product_ids?: number[]
  usage_limit?: number
  usage_limit_per_user?: number
  limit_usage_to_x_items?: number
  free_shipping?: boolean
  product_categories?: number[]
  excluded_product_categories?: number[]
  exclude_sale_items?: boolean
  minimum_amount?: string
  maximum_amount?: string
  email_restrictions?: string[]
  meta_data?: Array<{ key: string, value: string }>
}

export class UpdateCouponDto {
  code?: string
  discount_type?: 'percent' | 'fixed_cart' | 'fixed_product'
  amount?: string
  description?: string
  date_expires?: string
  individual_use?: boolean
  product_ids?: number[]
  excluded_product_ids?: number[]
  usage_limit?: number
  usage_limit_per_user?: number
  limit_usage_to_x_items?: number
  free_shipping?: boolean
  product_categories?: number[]
  excluded_product_categories?: number[]
  exclude_sale_items?: boolean
  minimum_amount?: string
  maximum_amount?: string
  email_restrictions?: string[]
  meta_data?: Array<{ key: string, value: string }>
}
