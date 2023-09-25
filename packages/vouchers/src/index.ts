import * as Schema from "@effect/schema/Schema"
import * as Sql from "@sqlfx/sqlite/Client"
import { Context, Effect, flow, identity, Layer } from "effect"

export const VoucherId = Schema.number.pipe(Schema.brand("VoucherId"))
export type VoucherId = Schema.Schema.To<typeof VoucherId>

export class Voucher extends Schema.Class<Voucher>()({
  id: VoucherId,
  name: Schema.string,
  balance: Schema.optionFromNullable(Schema.Int),
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
}) {}

const VoucherCreate = Voucher.struct.pipe(
  Schema.omit("id", "createdAt", "updatedAt"),
)
export type VoucherCreate = Schema.Schema.To<typeof VoucherCreate>

const VoucherUpdate = Schema.transform(
  Voucher.struct.pipe(
    Schema.omit("id", "createdAt"),
    Schema.partial,
    Schema.extend(Schema.struct({ id: VoucherId })),
  ),
  Voucher.struct.pipe(
    Schema.omit("id", "createdAt", "updatedAt"),
    Schema.partial,
    Schema.extend(Schema.struct({ id: VoucherId })),
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
      voucher => sql`INSERT INTO vouchers ${sql(voucher)} RETURNING *`,
    ),
    Effect.withSpan("Vouchers.create"),
  )

  const update_ = sql.singleSchema(
    VoucherUpdate,
    Voucher,
    voucher => sql`
      UPDATE vouchers
      SET ${sql(voucher, ["id"])}
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
