export class CustomerAddressDto {
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

export class CreateCustomerDto {
  email: string
  first_name?: string
  last_name?: string
  username?: string
  password?: string
  billing?: CustomerAddressDto
  shipping?: CustomerAddressDto
  meta_data?: Array<{ key: string, value: string }>
}

export class UpdateCustomerDto {
  email?: string
  first_name?: string
  last_name?: string
  password?: string
  billing?: CustomerAddressDto
  shipping?: CustomerAddressDto
  meta_data?: Array<{ key: string, value: string }>
}
