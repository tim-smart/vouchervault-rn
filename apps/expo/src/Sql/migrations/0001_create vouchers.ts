import * as Sql from "@sqlfx/sqlite/Client"
import { Effect } from "effect"

export default Effect.flatMap(
  Sql.tag,
  sql => sql`
    CREATE TABLE IF NOT EXISTS vouchers (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      name VARCHAR(255) NOT NULL,
      code VARCHAR(255) NOT NULL,
      code_type VARCHAR(255) NOT NULL,
      color VARCHAR(255),
      balance INTEGER,
      notes TEXT,
      expires_at datetime,
      created_at datetime NOT NULL DEFAULT current_timestamp,
      updated_at datetime NOT NULL DEFAULT current_timestamp
    );
  `,
)
