import { db } from "@/db";
import { financeCostCenter } from "@/db/schema/finance";
import { eq, and } from "drizzle-orm";

export const listCostCenters = async (organizationId: string) => {
  return await db.query.financeCostCenter.findMany({
    where: eq(financeCostCenter.organizationId, organizationId),
  });
};

export const getCostCenterById = async (id: string, organizationId: string) => {
  return await db.query.financeCostCenter.findFirst({
    where: and(
      eq(financeCostCenter.id, id),
      eq(financeCostCenter.organizationId, organizationId),
    ),
  });
};
