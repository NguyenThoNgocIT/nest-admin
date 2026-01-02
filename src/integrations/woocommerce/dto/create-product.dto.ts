export class CreateProductDto {
  name: string
  type?: string
  regular_price?: string
  description?: string
  short_description?: string
  categories?: { id: number }[]
  images?: { src: string }[]
}
