import { getSessionContext } from "@/lib/utils/db-utils";
import { db } from "@/db";
import { branch } from "@/db/schema/organization";
import { eq } from "drizzle-orm";

export const getBranches = async () => {
  const { organizationId } = await getSessionContext();

  const branches = await db.query.branch.findMany({
    where: eq(branch.organizationId, organizationId),
  });

  return branches;
};
