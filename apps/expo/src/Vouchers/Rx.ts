import { Result, Rx } from "@effect-rx/rx-react"
import { Effect } from "effect"

import type { VoucherCreate, VoucherId, VoucherUpdate } from "@vv/vouchers"
import { Vouchers, VouchersLive } from "@vv/vouchers"

import { sqlRuntime } from "~/Sql"

const runtime = Rx.runtime(VouchersLive, {
  runtime: sqlRuntime,
})

const { all, clear } = Effect.serviceConstants(Vouchers)
const { create, find, update, remove } = Effect.serviceFunctions(Vouchers)

export const vouchersRx = Rx.effect(() => all, { runtime }).pipe(
  Rx.map(Result.noWaiting),
  Rx.refreshable,
)

export const voucherByIdRx = Rx.family((id: VoucherId) =>
  Rx.effect(() => find(id), { runtime }).pipe(
    Rx.map(Result.noWaiting),
    Rx.refreshable,
  ),
)

export const createVoucherRx = Rx.effectFn(
  (_: VoucherCreate, get) =>
    create(_).pipe(
      Effect.zipLeft(get.refresh(vouchersRx)),
      Effect.tapErrorCause(Effect.logError),
    ),
  { runtime },
).pipe(Rx.withLabel("createVoucherRx"))

export const updateVoucherRx = Rx.effectFn(
  (_: VoucherUpdate, get) =>
    update(_).pipe(
      Effect.zipLeft(get.refresh(voucherByIdRx(_.id))),
      Effect.zipLeft(get.refresh(vouchersRx)),
      Effect.tapErrorCause(Effect.logError),
    ),
  { runtime },
)

export const removeVoucherRx = Rx.effectFn(
  (_: VoucherId, get) =>
    remove(_).pipe(
      Effect.zipLeft(get.refresh(vouchersRx)),
      Effect.tapErrorCause(Effect.logError),
    ),
  { runtime },
)

export const clearVouchersRx = Rx.effectFn(
  (_: void, get) =>
    clear.pipe(
      Effect.zipLeft(get.refresh(vouchersRx)),
      Effect.tapErrorCause(Effect.logError),
    ),
  { runtime },
)
