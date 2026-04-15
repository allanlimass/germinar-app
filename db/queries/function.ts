import { db } from "@/db";
import { churchFunction } from "@/db/schema/people";
import { and, eq } from "drizzle-orm";

export const listChurchFunctions = async (organizationId: string) => {
  return await db.query.churchFunction.findMany({
    where: eq(churchFunction.organizationId, organizationId),
  });
};

export const getChurchFunctionById = async (
  id: string,
  organizationId: string,
) => {
  return await db.query.churchFunction.findFirst({
    where: and(
      eq(churchFunction.id, id),
      eq(churchFunction.organizationId, organizationId),
    ),
  });
};
