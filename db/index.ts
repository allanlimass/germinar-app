import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

import * as auth from "./schema/auth";
import * as finance from "./schema/finance";
import * as people from "./schema/people";

export const db = drizzle(process.env.DATABASE_URL!, {
  schema: { ...auth, ...finance, ...people },
});
