import * as Schema from "@effect/schema/Schema"
import * as Sql from "@sqlfx/sqlite/Client"
import { Context, Effect, flow, identity, Layer, Option } from "effect"

export const VoucherId = Schema.number.pipe(Schema.brand("VoucherId"))
export type VoucherId = Schema.Schema.To<typeof VoucherId>

export const VoucherColors = [
  "gray",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "yellow",
] as const
export const VoucherColor = Schema.literal(...VoucherColors)
export type VoucherColor = Schema.Schema.To<typeof VoucherColor>

export class Voucher extends Schema.Class<Voucher>()({
  id: VoucherId,
  name: Schema.NonEmpty,
  code: Schema.NonEmpty,
  codeType: Schema.NonEmpty,
  color: VoucherColor,
  balance: Schema.optionFromNullable(Schema.Int),
  notes: Schema.optionFromNullable(Schema.NonEmpty),
  expiresAt: Schema.optionFromNullable(Schema.Date),
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
}) {
  static readonly empty: VoucherCreate = {
    name: "",
    code: "12345",
    codeType: "test",
    color: "gray",
    balance: Option.none(),
    notes: Option.none(),
    expiresAt: Option.none(),
  }
}

export const VoucherCreate = Voucher.struct.pipe(
  Schema.omit("id", "createdAt", "updatedAt"),
)
export type VoucherCreate = Schema.Schema.To<typeof VoucherCreate>

export const VoucherUpdate = Schema.transform(
  Voucher.struct.pipe(
    Schema.omit("id", "createdAt"),
    Schema.partial,
    Schema.extend(Schema.struct({ id: VoucherId })),
  ),
  Voucher.struct.pipe(
    Schema.omit("id", "createdAt", "updatedAt"),
    Schema.partial,
    Schema.extend(Schema.struct({ id: VoucherId })),
    Schema.to,
  ),
  identity,
  _ => ({ ..._, updatedAt: new Date() }),
)
export type VoucherUpdate = Schema.Schema.To<typeof VoucherUpdate>

const make = Effect.gen(function* (_) {
  const sql = yield* _(Sql.tag)

  const create = flow(
    sql.singleSchema(
      VoucherCreate,
      Voucher,
      voucher => sql`INSERT INTO vouchers ${sql.insert(voucher)} RETURNING *`,
    ),
    Effect.withSpan("Vouchers.create"),
  )

  const update_ = sql.singleSchema(
    VoucherUpdate,
    Voucher,
    voucher => sql`
      UPDATE vouchers
      SET ${sql.update(voucher, ["id"])}
      WHERE id = ${voucher.id!}
      RETURNING *
    `,
  )
  const update = (_: VoucherUpdate) =>
    update_(_).pipe(
      Effect.withSpan("Vouchers.update", { attributes: { id: _.id } }),
    )

  const remove = (id: VoucherId) =>
    sql`DELETE FROM vouchers WHERE id = ${id}`.pipe(
      Effect.asUnit,
      Effect.withSpan("Vouchers.remove", { attributes: { id } }),
    )

  const all = sql
    .schema(Schema.void, Voucher, () => sql`SELECT * FROM vouchers`)()
    .pipe(Effect.withSpan("Vouchers.all"))

  const find_ = sql.singleSchemaOption(
    VoucherId,
    Voucher,
    id => sql`SELECT * FROM vouchers WHERE id = ${id}`,
  )
  const find = (id: VoucherId) =>
    find_(id).pipe(
      Effect.flatten,
      Effect.withSpan("Vouchers.find", { attributes: { id } }),
    )

  const clear = Effect.all([
    sql`DELETE FROM vouchers`,
    sql`DELETE FROM sqlite_sequence WHERE name = 'vouchers'`,
  ]).pipe(Effect.withSpan("Vouchers.clear"))

  return { all, find, create, update, remove, clear } as const
})

export interface Vouchers extends Effect.Effect.Success<typeof make> {}
export const Vouchers = Context.Tag<Vouchers>("@vv/vouchers/Vouchers")
export const VouchersLive = Layer.effect(Vouchers, make)
