/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Schema from "@effect/schema/Schema"
import * as Sql from "@sqlfx/sqlite/Client"
import {
  Context,
  Data,
  Effect,
  flow,
  Layer,
  Option,
  ReadonlyArray,
} from "effect"

export class Setting<A> extends Data.Class<{
  readonly key: string
  readonly label: string
  readonly schema: Schema.Schema<any, A>
  readonly initialValue: A
}> {
  readonly jsonSchema = Schema.compose(Schema.ParseJson, this.schema)
  readonly decode = Schema.decode(this.jsonSchema)
  readonly encode = Schema.encode(this.jsonSchema)
}

const make = Effect.gen(function* (_) {
  const sql = yield* _(Sql.tag)

  const get = <A>(setting: Setting<A>) =>
    sql<{
      readonly value: string
    }>`SELECT value FROM settings WHERE key = ${setting.key}`.pipe(
      Effect.flatMap(
        flow(
          ReadonlyArray.head,
          Option.map(_ => _.value),
        ),
      ),
      Effect.flatMap(setting.decode),
      Effect.catchTag("NoSuchElementException", () =>
        Effect.succeed(setting.initialValue),
      ),
      Effect.withSpan("Settings.get", { attributes: { key: setting.key } }),
    )

  const set = <A>(setting: Setting<A>, value: A) =>
    setting.encode(value).pipe(
      Effect.tap(
        value => sql`
          INSERT INTO settings (key, value) VALUES (${setting.key}, ${value})
          ON CONFLICT(key) DO UPDATE SET value = ${value}
        `,
      ),
      Effect.asUnit,
      Effect.withSpan("Settings.set", { attributes: { key: setting.key } }),
    )

  const clear = <A>(setting: Setting<A>) =>
    sql`DELETE FROM settings WHERE key = ${setting.key}`.pipe(
      Effect.asUnit,
      Effect.withSpan("Settings.clear", { attributes: { key: setting.key } }),
    )

  return { get, set, clear } as const
})

export interface Settings extends Effect.Effect.Success<typeof make> {}
export const Settings = Context.Tag<Settings>("@vv/settings/Settings")
export const SettingsLive = Layer.effect(Settings, make)
