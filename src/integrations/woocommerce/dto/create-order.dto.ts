export class OrderBillingDto {
  first_name?: string
  last_name?: string
  company?: string
  address_1?: string
  address_2?: string
  city?: string
  state?: string
  postcode?: string
  country?: string
  email?: string
  phone?: string
}

export class OrderShippingDto {
  first_name?: string
  last_name?: string
  company?: string
  address_1?: string
  address_2?: string
  city?: string
  state?: string
  postcode?: string
  country?: string
}

export class OrderLineItemDto {
  product_id?: number
  variation_id?: number
  quantity?: number
}

export class OrderShippingLineDto {
  method_id: string
  method_title: string
  total: string
}

export class CreateOrderDto {
  payment_method?: string
  payment_method_title?: string
  set_paid?: boolean
  billing?: OrderBillingDto
  shipping?: OrderShippingDto
  line_items?: OrderLineItemDto[]
  shipping_lines?: OrderShippingLineDto[]
  customer_id?: number
  customer_note?: string
  status?: string
}

export class UpdateOrderDto {
  status?: string
  customer_note?: string
  billing?: OrderBillingDto
  shipping?: OrderShippingDto
  payment_method?: string
  payment_method_title?: string
  transaction_id?: string
  meta_data?: Array<{ key: string, value: string }>
}
