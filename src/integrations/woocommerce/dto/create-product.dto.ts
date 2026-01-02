export class ProductImageDto {
  src: string
}

export class ProductCategoryDto {
  id: number
}

export class CreateProductDto {
  name: string
  type?: string
  regular_price?: string
  description?: string
  short_description?: string
  categories?: ProductCategoryDto[]
  images?: ProductImageDto[]
}
