"use server";

import { actionClient } from "@/lib/safe-action/safe-action";
import { db } from "@/db";
import { financeChartOfAccounts } from "@/db/schema/finance";
import { and, eq } from "drizzle-orm";
import {
  createChartOfAccountSchema,
  updateChartOfAccountSchema,
  deleteChartOfAccountSchema,
} from "@/lib/validations/chart-of-account";
import { revalidatePath } from "next/cache";

export const createChartOfAccount = actionClient
  .inputSchema(createChartOfAccountSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId } = ctx;
    const { parentId, ...data } = parsedInput;

    revalidatePath("/finance/chart-of-accounts");

    await db
      .insert(financeChartOfAccounts)
      .values({ ...data, organizationId, parentId: parentId || null });
  });

export const updateChartOfAccount = actionClient
  .inputSchema(updateChartOfAccountSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId } = ctx;
    const { id, parentId, ...data } = parsedInput;

    revalidatePath("/finance/chart-of-accounts");

    await db
      .update(financeChartOfAccounts)
      .set({ ...data, parentId: parentId || null })
      .where(
        and(
          eq(financeChartOfAccounts.id, id),
          eq(financeChartOfAccounts.organizationId, organizationId),
        ),
      );
  });

export const deleteChartOfAccount = actionClient
  .inputSchema(deleteChartOfAccountSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId } = ctx;
    const { id } = parsedInput;

    revalidatePath("/finance/chart-of-accounts");

    await db
      .delete(financeChartOfAccounts)
      .where(
        and(
          eq(financeChartOfAccounts.id, id),
          eq(financeChartOfAccounts.organizationId, organizationId),
        ),
      );
  });
