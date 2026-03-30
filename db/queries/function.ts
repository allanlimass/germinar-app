import { getSessionContext } from "@/lib/utils/db-utils";
import { db } from "@/db";
import { churchFunction } from "@/db/schema/people";
import { eq } from "drizzle-orm";

export async function getFunctions() {
  const { organizationId } = await getSessionContext();

  const functions = await db.query.churchFunction.findMany({
    where: eq(churchFunction.organizationId, organizationId),
  });

  return functions;
}
