import { db } from "@/db";
import { and, asc, eq } from "drizzle-orm";
import { branch } from "@/db/schema/organization";

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
