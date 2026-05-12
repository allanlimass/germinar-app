import { db } from "@/db";
import { and, asc, eq } from "drizzle-orm";
import { branch, branchMember } from "@/db/schema/organization";

export const getBranches = (organizationId: string) => {
  return db.query.branch.findMany({
    where: eq(branch.organizationId, organizationId),
    orderBy: [asc(branch.name)],
  });
};

export const getBranchById = (id: string) => {
  return db.query.branch.findFirst({
    where: eq(branch.id, id),
  });
};

type BranchType = "headquarters" | "regional" | "local";

export const getBranchesByType = (type: BranchType) => {
  return db.query.branch.findMany({
    where: and(eq(branch.type, type)),
    orderBy: [asc(branch.name)],
  });
};

export const getBranchesByUserId = async (
  organizationId: string,
  userId: string,
) => {
  return await db
    .select({
      id: branch.id,
      name: branch.name,
      type: branch.type,
      city: branch.city,
      state: branch.state,
    })
    .from(branch)
    .innerJoin(branchMember, eq(branch.id, branchMember.branchId))
    .where(
      and(
        eq(branch.organizationId, organizationId),
        eq(branchMember.userId, userId),
      ),
    );
};
