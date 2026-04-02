import { getSessionContext } from "@/lib/utils/db-utils";
import { db } from "@/db";
import { churchPosition } from "@/db/schema/people";
import { and, eq } from "drizzle-orm";

export const getChurchPositions = async () => {
  const { organizationId } = await getSessionContext();

  return await db.query.churchPosition.findMany({
    where: eq(churchPosition.organizationId, organizationId),
  });
};

export const getChurchPositionById = async (id: string) => {
  const { organizationId } = await getSessionContext();

  return await db.query.churchPosition.findFirst({
    where: and(
      eq(churchPosition.id, id),
      eq(churchPosition.organizationId, organizationId),
    ),
  });
};
