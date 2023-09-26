import { Rx } from "@effect-rx/rx-react"
import * as Schema from "@effect/schema/Schema"
import { Effect } from "effect"

import * as Settings from "@vv/settings"

import { sqlRuntime } from "~/Sql"

export const smartScan = new Settings.Setting({
  key: "smartScan",
  label: "Smart Scan",
  schema: Schema.boolean,
  initialValue: true,
})

// Rx bindings

const runtime = Rx.runtime(Settings.SettingsLive, { runtime: sqlRuntime })
const get = Effect.serviceFunctionEffect(Settings.Settings, _ => _.get)
const set = Effect.serviceFunctionEffect(Settings.Settings, _ => _.set)
const clear = Effect.serviceFunctionEffect(Settings.Settings, _ => _.clear)

export const settingRx = Rx.family(<A>(setting: Settings.Setting<A>) => {
  const read = Rx.effect(
    () => get(setting).pipe(Effect.tapErrorCause(Effect.logError)),
    { runtime },
  ).pipe(Rx.refreshable)

  const write = Rx.effectFn(
    (_: A, get) =>
      set(setting, _).pipe(
        Effect.zipLeft(get.refresh(read)),
        Effect.tapErrorCause(Effect.logError),
      ),
    { runtime },
  )

  return Rx.writable(
    get => {
      get.mount(write)
      return get(read)
    },
    (ctx, value: A) => ctx.set(write, value),
    refresh => refresh(read),
  ).pipe(Rx.refreshable)
})

export const clearSettingRx = Rx.family(<A>(setting: Settings.Setting<A>) =>
  Rx.effectFn(
    (_: void, get) =>
      clear(setting).pipe(
        Effect.zipLeft(get.refresh(settingRx(setting))),
        Effect.tapErrorCause(Effect.logError),
      ),
    { runtime },
  ),
)
