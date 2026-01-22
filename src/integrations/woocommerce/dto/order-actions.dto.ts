export class CreateOrderNoteDto {
  note: string
  customer_note?: boolean
  added_by_user?: boolean
}

export class SendOrderDetailsDto {
  email?: string
  force_email_update?: boolean
}

export class SendOrderEmailDto {
  template_id: string
  email?: string
  force_email_update?: boolean
}
