import { db } from "@/db";
import { financeChartOfAccounts } from "@/db/schema/finance";
import { eq } from "drizzle-orm";

export const listChartOfAccounts = async (organizationId: string) => {
  return await db.query.financeChartOfAccounts.findMany({
    where: eq(financeChartOfAccounts.organizationId, organizationId),
    with: {
      parent: {
        columns: { id: true, name: true },
      },
    },
  });
};

export const getChartOfAccountById = async (id: string) => {
  return await db.query.financeChartOfAccounts.findFirst({
    where: eq(financeChartOfAccounts.id, id),
  });
};
