import { db } from "@/db";
import { branch, branchMember } from "@/db/schema/organization";
import { and, eq } from "drizzle-orm";
import { user } from "../schema/auth";

export const getBranchMembers = async (
  organizationId: string,
  branchId: string,
) => {
  return db
    .select({
      id: branchMember.id,
      name: user.name,
      email: user.email,
      role: branchMember.role,
    })
    .from(branchMember)
    .innerJoin(user, eq(user.id, branchMember.userId))
    .innerJoin(
      branch,
      and(
        eq(branch.id, branchMember.branchId),
        eq(branch.organizationId, organizationId),
      ),
    )
    .where(eq(branchMember.branchId, branchId));
};

export const getBranchMemberByUserId = async (userId: string) => {
  return await db.query.branchMember.findFirst({
    where: eq(branchMember.userId, userId),
  });
};
