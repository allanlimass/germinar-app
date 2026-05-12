import { db } from "@/db";
import { churchMember } from "@/db/schema/people";
import { and, desc, eq } from "drizzle-orm";

export const getChurchMembers = async (
  organizationId: string,
  branchId: string,
) => {
  return await db.query.churchMember.findMany({
    where: and(
      eq(churchMember.organizationId, organizationId),
      eq(churchMember.branchId, branchId),
    ),
    orderBy: [desc(churchMember.createdAt)],
  });
};

export const getChurchMemberById = async (
  id: string,
  organizationId: string,
  branchId: string,
) => {
  return await db.query.churchMember.findFirst({
    where: and(
      eq(churchMember.id, id),
      eq(churchMember.organizationId, organizationId),
      eq(churchMember.branchId, branchId),
    ),
  });
};
