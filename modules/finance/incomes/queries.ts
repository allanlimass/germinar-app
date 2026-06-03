import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { financeTransaction } from "@/db/schema/finance";

export const getIncomes = async (organizationId: string, branchId: string) => {
  return await db.query.financeTransaction.findMany({
    where: and(
      eq(financeTransaction.organizationId, organizationId),
      eq(financeTransaction.branchId, branchId),
      eq(financeTransaction.type, "income"),
    ),
  });
};

export const getIncomeById = async (
  organizationId: string,
  branchId: string,
  id: string,
) => {
  return await db.query.financeTransaction.findFirst({
    where: and(
      eq(financeTransaction.organizationId, organizationId),
      eq(financeTransaction.branchId, branchId),
      eq(financeTransaction.id, id),
    ),
  });
};
