import { db } from "@/db";
import { churchPosition } from "@/db/schema/people";
import { and, desc, eq } from "drizzle-orm";

export const listChurchPositions = async (organizationId: string) => {
  return await db.query.churchPosition.findMany({
    where: eq(churchPosition.organizationId, organizationId),
    orderBy: desc(churchPosition.createdAt),
  });
};

export const getChurchPositionById = async (
  id: string,
  organizationId: string,
) => {
  return await db.query.churchPosition.findFirst({
    where: and(
      eq(churchPosition.id, id),
      eq(churchPosition.organizationId, organizationId),
    ),
  });
};
