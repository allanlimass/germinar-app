import { db } from "@/db";
import { churchFunction } from "@/db/schema/people";
import { and, eq } from "drizzle-orm";

export const getChurchFunctions = async (
  organizationId: string,
  branchId: string,
) => {
  return await db.query.churchFunction.findMany({
    where: and(
      eq(churchFunction.organizationId, organizationId),
      eq(churchFunction.branchId, branchId),
    ),
  });
};

export const getChurchFunctionById = async (
  id: string,
  organizationId: string,
  branchId: string,
) => {
  return await db.query.churchFunction.findFirst({
    where: and(
      eq(churchFunction.id, id),
      eq(churchFunction.organizationId, organizationId),
      eq(churchFunction.branchId, branchId),
    ),
  });
};
