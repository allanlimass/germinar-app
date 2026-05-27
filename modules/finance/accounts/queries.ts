import { db } from "@/db";
import { and, eq, getTableColumns, sql } from "drizzle-orm";
import { financeAccount, bank, financeTransaction } from "@/db/schema/finance";

export const getAccounts = async (organizationId: string, branchId: string) => {
  return await db.query.financeAccount.findMany({
    where: and(
      eq(financeAccount.organizationId, organizationId),
      eq(financeAccount.branchId, branchId),
    ),
    with: {
      bank: true,
    },
  });
};

export const getAccountById = async (
  organizationId: string,
  branchId: string,
  id: string,
) => {
  return await db.query.financeAccount.findFirst({
    where: and(
      eq(financeAccount.organizationId, organizationId),
      eq(financeAccount.branchId, branchId),
      eq(financeAccount.id, id),
    ),
    with: {
      bank: true,
    },
  });
};

export const getBanks = async () => {
  return await db.query.bank.findMany();
};

export const getFinanceAccounts = async (
  organizationId: string,
  branchId: string,
) => {
  const balanceSub = db
    .select({
      financeAccountId: financeTransaction.financeAccountId,
      balance: sql<number>`COALESCE(SUM(CAST(amount AS NUMERIC)), 0)`.as(
        "balance",
      ),
    })
    .from(financeTransaction)
    .where(eq(financeTransaction.status, "paid"))
    .groupBy(financeTransaction.financeAccountId)
    .as("balance_sub");

  return await db
    .select({
      ...getTableColumns(financeAccount),
      bank: bank,
      balance: balanceSub.balance,
    })
    .from(financeAccount)
    .where(
      and(
        eq(financeAccount.organizationId, organizationId),
        eq(financeAccount.branchId, branchId),
      ),
    )
    .leftJoin(bank, eq(financeAccount.bankId, bank.id))
    .leftJoin(balanceSub, eq(financeAccount.id, balanceSub.financeAccountId));
};
