import { Rx } from "@effect-rx/rx-react"
import * as Schema from "@effect/schema/Schema"
import { Effect, Layer } from "effect"

import * as Settings from "@vv/settings"

import { SqlLive } from "~/Sql"

export const smartScan = new Settings.Setting({
  key: "smartScan",
  label: "Smart Scan",
  schema: Schema.boolean,
  initialValue: true,
})

// Rx bindings

const runtime = Rx.make(
  Settings.SettingsLive.pipe(Layer.provide(SqlLive)),
).pipe(Rx.setIdleTTL("5 seconds"))
const get = Effect.serviceFunctionEffect(Settings.Settings, _ => _.get)
const set = Effect.serviceFunctionEffect(Settings.Settings, _ => _.set)
const clear = Effect.serviceFunctionEffect(Settings.Settings, _ => _.clear)

export const settingRx = Rx.family(<A>(setting: Settings.Setting<A>) => {
  const read = runtime
    .rx(get(setting).pipe(Effect.tapErrorCause(Effect.logError)))
    .pipe(Rx.refreshable)

  const write = runtime.fn((_: A, get) =>
    set(setting, _).pipe(
      Effect.zipLeft(get.refresh(read)),
      Effect.tapErrorCause(Effect.logError),
    ),
  )

  return Rx.writable(
    get => {
      get.mount(write)
      return get(read)
    },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    (ctx, value: A) => ctx.set(write, value as any),
    refresh => refresh(read),
  ).pipe(Rx.refreshable)
})

export const clearSettingRx = Rx.family(<A>(setting: Settings.Setting<A>) =>
  runtime.fn((_: void, get) =>
    clear(setting).pipe(
      Effect.zipLeft(get.refresh(settingRx(setting))),
      Effect.tapErrorCause(Effect.logError),
    ),
  ),
)
