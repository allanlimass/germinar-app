import { db } from "@/db";
import { churchMember } from "@/db/schema/people";
import { getSessionContext } from "@/lib/utils/db-utils";
import { and, eq } from "drizzle-orm";

export const listChurchMembers = async () => {
  const { organizationId } = await getSessionContext();

  return await db.query.churchMember.findMany({
    where: eq(churchMember.organizationId, organizationId),
  });
};

export const getChurchMemberById = async (id: string) => {
  const { organizationId } = await getSessionContext();

  return await db.query.churchMember.findFirst({
    where: and(
      eq(churchMember.id, id),
      eq(churchMember.organizationId, organizationId),
    ),
  });
};
