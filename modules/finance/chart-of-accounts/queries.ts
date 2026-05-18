import { db } from "@/db";
import { financeChartOfAccounts } from "@/db/schema/finance";
import { and, eq } from "drizzle-orm";

export const getChartOfAccounts = async (
  organizationId: string,
  branchId: string,
) => {
  return await db.query.financeChartOfAccounts.findMany({
    where: and(
      eq(financeChartOfAccounts.organizationId, organizationId),
      eq(financeChartOfAccounts.branchId, branchId),
    ),
  });
};

export const getChartOfAccountById = async (
  id: string,
  organizationId: string,
  branchId: string,
) => {
  return await db.query.financeChartOfAccounts.findFirst({
    where: and(
      eq(financeChartOfAccounts.id, id),
      eq(financeChartOfAccounts.organizationId, organizationId),
      eq(financeChartOfAccounts.branchId, branchId),
    ),
  });
};
