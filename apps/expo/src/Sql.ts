import { Rx } from "@effect-rx/rx-react"
import * as Sql from "@sqlfx/sqlite/expo"
import * as Migrator from "@sqlfx/sqlite/Migrator"
import { Layer } from "effect"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as migrations from "./Sql/migrations/*"

const SqlLive = Sql.makeLayer({
  database: "vouchervault.db",
  transformQueryNames: Sql.transform.fromCamel,
  transformResultNames: Sql.transform.toCamel,
})

const MigratorLive = Migrator.makeLayer({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  loader: Migrator.fromBabelGlob(migrations),
})

export const sqlRuntime = Rx.runtime(Layer.provideMerge(SqlLive, MigratorLive))
