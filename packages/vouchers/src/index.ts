import * as Schema from "@effect/schema/Schema"

export const VoucherId = Schema.number.pipe(Schema.brand("VoucherId"))
export type VoucherId = Schema.Schema.To<typeof VoucherId>

export class Voucher extends Schema.Class<Voucher>()({
  id: VoucherId,
  name: Schema.string,
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
}) {}
