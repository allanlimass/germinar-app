import { db } from "@/db";
import { financeCostCenter } from "@/db/schema/finance";
import { eq, and } from "drizzle-orm";

export const getCostCenters = async (
  organizationId: string,
  branchId: string,
) => {
  return await db.query.financeCostCenter.findMany({
    where: and(
      eq(financeCostCenter.organizationId, organizationId),
      eq(financeCostCenter.branchId, branchId),
    ),
  });
};

export const getCostCenterById = async (
  id: string,
  organizationId: string,
  branchId: string,
) => {
  return await db.query.financeCostCenter.findFirst({
    where: and(
      eq(financeCostCenter.id, id),
      eq(financeCostCenter.organizationId, organizationId),
      eq(financeCostCenter.branchId, branchId),
    ),
  });
};
