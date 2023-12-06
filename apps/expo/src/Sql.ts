import * as Migrator from "@sqlfx/sqlite/Migrator"
import * as Sql from "@sqlfx/sqlite/react-native"
import { Effect, Layer } from "effect"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as migrations from "./Sql/migrations/*"

export const SqlLive = Migrator.makeLayer({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  loader: Migrator.fromBabelGlob(migrations),
}).pipe(
  Layer.provideMerge(
    Sql.makeLayer({
      filename: "vouchervault.db",
      transformQueryNames: Sql.transform.camelToSnake,
      transformResultNames: Sql.transform.snakeToCamel,
    }),
  ),
  Layer.provide(Layer.effectDiscard(Effect.log("building SqlLive"))),
)
