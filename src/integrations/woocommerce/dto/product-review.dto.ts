export class CreateProductReviewDto {
  product_id: number
  review: string
  reviewer: string
  reviewer_email: string
  rating: number
  status?: string
  verified?: boolean
}

export class UpdateProductReviewDto {
  product_id?: number
  review?: string
  reviewer?: string
  reviewer_email?: string
  rating?: number
  status?: string
  verified?: boolean
}

export class BatchProductReviewDto {
  create?: CreateProductReviewDto[]
  update?: (UpdateProductReviewDto & { id: number })[]
  delete?: number[]
}
