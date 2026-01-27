export class CreateProductAttributeTermDto {
  name: string
  slug?: string
  description?: string
  menu_order?: number
}

export class UpdateProductAttributeTermDto {
  name?: string
  slug?: string
  description?: string
  menu_order?: number
}

export class BatchProductAttributeTermDto {
  create?: CreateProductAttributeTermDto[]
  update?: (UpdateProductAttributeTermDto & { id: number })[]
  delete?: number[]
}
