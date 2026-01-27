export class CreateProductTagDto {
  name: string
  slug?: string
  description?: string
}

export class UpdateProductTagDto {
  name?: string
  slug?: string
  description?: string
}

export class BatchProductTagDto {
  create?: CreateProductTagDto[]
  update?: (UpdateProductTagDto & { id: number })[]
  delete?: number[]
}
