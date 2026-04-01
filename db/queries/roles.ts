import { getSessionContext } from "@/lib/utils/db-utils";
import { db } from "@/db";
import { churchRole } from "@/db/schema/people";
import { and, eq } from "drizzle-orm";

export const getChurchRoles = async () => {
  const { organizationId } = await getSessionContext();

  return await db.query.churchRole.findMany({
    where: eq(churchRole.organizationId, organizationId),
  });
};

export const getChurchRoleById = async (id: string) => {
  const { organizationId } = await getSessionContext();

  return await db.query.churchRole.findFirst({
    where: and(
      eq(churchRole.id, id),
      eq(churchRole.organizationId, organizationId),
    ),
  });
};
