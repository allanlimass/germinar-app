import { db } from "@/db";
import { churchMember } from "@/db/schema/people";
import { and, desc, eq } from "drizzle-orm";

export const listChurchMembers = async (organizationId: string) => {
  return await db.query.churchMember.findMany({
    where: eq(churchMember.organizationId, organizationId),
    orderBy: [desc(churchMember.createdAt)],
  });
};

export const getChurchMemberById = async (
  id: string,
  organizationId: string,
) => {
  return await db.query.churchMember.findFirst({
    where: and(
      eq(churchMember.id, id),
      eq(churchMember.organizationId, organizationId),
    ),
  });
};
