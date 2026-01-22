export class ReportSalesDto {
  total_sales: string
  net_sales: string
  average_sales: string
  total_orders: number
  total_items: number
  total_tax: string
  total_shipping: string
  total_refunds: number
  total_discount: number
  totals_grouped_by: string
  totals: Record<string, any> // Date keys
  total_customers: number
}

export class ReportTopSellerDto {
  title: string
  product_id: number
  quantity: number
}

export class ReportTotalDto {
  slug: string
  name: string
  total: string | number
}

export class ReportListDto {
  slug: string
  description: string
  _links: any
}
