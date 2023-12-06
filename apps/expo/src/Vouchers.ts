import { Rx } from "@effect-rx/rx-react"
import { Effect, Layer } from "effect"

import type { VoucherCreate, VoucherId, VoucherUpdate } from "@vv/vouchers"
import { Vouchers, VouchersLive } from "@vv/vouchers"

import { SqlLive } from "~/Sql"

const runtime = Rx.make(VouchersLive.pipe(Layer.provide(SqlLive))).pipe(
  Rx.keepAlive,
)

const { all, clear } = Effect.serviceConstants(Vouchers)
const { create, find, update, remove } = Effect.serviceFunctions(Vouchers)

export const vouchersRx = runtime.rx(all).pipe(Rx.refreshable)

export const voucherByIdRx = Rx.family((id: VoucherId) =>
  runtime.rx(find(id)).pipe(Rx.refreshable),
)

export const createVoucherRx = runtime.fn((_: VoucherCreate, get) =>
  create(_).pipe(
    Effect.zipLeft(get.refresh(vouchersRx)),
    Effect.tapErrorCause(Effect.logError),
  ),
)

export const updateVoucherRx = runtime.fn((_: VoucherUpdate, get) =>
  update(_).pipe(
    Effect.zipLeft(get.refresh(voucherByIdRx(_.id))),
    Effect.zipLeft(get.refresh(vouchersRx)),
    Effect.tapErrorCause(Effect.logError),
  ),
)

export const removeVoucherRx = runtime.fn((_: VoucherId, get) =>
  remove(_).pipe(
    Effect.zipLeft(get.refresh(vouchersRx)),
    Effect.tapErrorCause(Effect.logError),
  ),
)

export const clearVouchersRx = runtime.fn((_: void, get) =>
  clear.pipe(
    Effect.zipLeft(get.refresh(vouchersRx)),
    Effect.tapErrorCause(Effect.logError),
  ),
)
