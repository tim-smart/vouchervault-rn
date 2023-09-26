import * as Sql from "@sqlfx/sqlite/Client"
import { Effect } from "effect"

export default Effect.flatMap(
  Sql.tag,
  sql => sql`
    CREATE TABLE IF NOT EXISTS settings (
      key VARCHAR(255) NOT NULL PRIMARY KEY,
      value TEXT NOT NULL
    );
  `,
)
