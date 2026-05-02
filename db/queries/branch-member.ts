import { db } from "@/db";
import { branchMember } from "@/db/schema/organization";
import { eq } from "drizzle-orm";

export const listBranchMembers = async (branchId: string) => {
  return await db.query.branchMember.findMany({
    where: eq(branchMember.branchId, branchId),
  });
};

export const getMemberByUserId = async (userId: string) => {
  return await db.query.branchMember.findFirst({
    where: eq(branchMember.userId, userId),
  });
};
