import { db } from "@/db";
import { and, asc, eq } from "drizzle-orm";
import { branch, branchMember } from "@/db/schema/organization";

export const listBranches = (organizationId: string) => {
  return db.query.branch.findMany({
    where: eq(branch.organizationId, organizationId),
    orderBy: [asc(branch.name)],
  });
};

export const listBranchById = (id: string) => {
  return db.query.branch.findFirst({
    where: eq(branch.id, id),
  });
};

type BranchType = "headquarters" | "regional" | "local";

export const listBranchesByType = (type: BranchType) => {
  return db.query.branch.findMany({
    where: and(eq(branch.type, type)),
    orderBy: [asc(branch.name)],
  });
};

export const listBranchesByUserId = async (
  userId: string,
  organizationId: string,
) => {
  const branchMembers = await db.query.branchMember.findMany({
    where: and(eq(branchMember.userId, userId)),
    with: {
      branch: {
        with: {
          organization: {
            columns: {
              id: true,
              name: true,
              slug: true,
            },
          },
          members: {
            columns: {
              id: true,
            },
          },
        },
      },
    },
  });

  return branchMembers
    .filter((bm) => bm.branch.organizationId === organizationId)
    .map((bm) => ({
      ...bm.branch,
      role: bm.role,
    }));
};
