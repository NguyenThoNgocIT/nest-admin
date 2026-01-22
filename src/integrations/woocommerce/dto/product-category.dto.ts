export class CreateProductCategoryDto {
  name: string
  slug?: string
  parent?: number
  description?: string
  display?: string
  image?: {
    id?: number
    src?: string
    name?: string
    alt?: string
  }

  menu_order?: number
}

export class UpdateProductCategoryDto {
  name?: string
  slug?: string
  parent?: number
  description?: string
  display?: string
  image?: {
    id?: number
    src?: string
    name?: string
    alt?: string
  }

  menu_order?: number
}

export class BatchProductCategoryDto {
  create?: CreateProductCategoryDto[]
  update?: (UpdateProductCategoryDto & { id: number })[]
  delete?: number[]
}
