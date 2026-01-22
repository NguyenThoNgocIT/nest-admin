export class CreateProductShippingClassDto {
  name: string
  slug?: string
  description?: string
}

export class UpdateProductShippingClassDto {
  name?: string
  slug?: string
  description?: string
}

export class BatchProductShippingClassDto {
  create?: CreateProductShippingClassDto[]
  update?: (UpdateProductShippingClassDto & { id: number })[]
  delete?: number[]
}
