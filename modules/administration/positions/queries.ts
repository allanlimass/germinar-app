import { db } from "@/db";
import { churchPosition } from "@/db/schema/people";
import { and, desc, eq } from "drizzle-orm";

export const getChurchPositions = async (
  organizationId: string,
  branchId: string,
) => {
  return await db.query.churchPosition.findMany({
    where: and(
      eq(churchPosition.organizationId, organizationId),
      eq(churchPosition.branchId, branchId),
    ),
    orderBy: desc(churchPosition.createdAt),
  });
};

export const getChurchPositionById = async (
  id: string,
  organizationId: string,
  branchId: string,
) => {
  return await db.query.churchPosition.findFirst({
    where: and(
      eq(churchPosition.id, id),
      eq(churchPosition.organizationId, organizationId),
      eq(churchPosition.branchId, branchId),
    ),
  });
};
