"use server";

import { branchActionClient } from "@/lib/safe-action";
import { db } from "@/db";
import { financeChartOfAccounts } from "@/db/schema/finance";
import { and, eq } from "drizzle-orm";
import {
  createChartOfAccountsSchema,
  updateChartOfAccountsSchema,
  deleteChartOfAccountsSchema,
} from "./schemas";
import { revalidatePath } from "next/cache";

export const createChartOfAccount = branchActionClient
  .inputSchema(createChartOfAccountsSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId, branchId } = ctx;
    const { parentId, ...data } = parsedInput;

    revalidatePath("/finance/chart-of-accounts");

    await db.insert(financeChartOfAccounts).values({
      ...data,
      organizationId,
      branchId,
      parentId: parentId || null,
    });
  });

export const updateChartOfAccount = branchActionClient
  .inputSchema(updateChartOfAccountsSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId, branchId } = ctx;
    const { id, parentId, ...data } = parsedInput;

    revalidatePath("/finance/chart-of-accounts");

    await db
      .update(financeChartOfAccounts)
      .set({ ...data, parentId: parentId || null })
      .where(
        and(
          eq(financeChartOfAccounts.id, id),
          eq(financeChartOfAccounts.organizationId, organizationId),
          eq(financeChartOfAccounts.branchId, branchId),
        ),
      );
  });

export const deleteChartOfAccount = branchActionClient
  .inputSchema(deleteChartOfAccountsSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId, branchId } = ctx;
    const { id } = parsedInput;

    revalidatePath("/finance/chart-of-accounts");

    await db
      .delete(financeChartOfAccounts)
      .where(
        and(
          eq(financeChartOfAccounts.id, id),
          eq(financeChartOfAccounts.organizationId, organizationId),
          eq(financeChartOfAccounts.branchId, branchId),
        ),
      );
  });
