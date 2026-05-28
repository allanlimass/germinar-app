"use server";

import { branchActionClient } from "@/lib/safe-action";
import {
  createTransactionSchema,
  deleteTransactionSchema,
  updateTransactionSchema,
} from "./schemas";
import { db } from "@/db";
import { financeTransaction } from "@/db/schema/finance";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const createTransaction = branchActionClient
  .inputSchema(createTransactionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId, branchId } = ctx;

    await db.insert(financeTransaction).values({
      organizationId,
      ...parsedInput,
      branchId,
    });

    revalidatePath(`/finance`);
  });

export const updateTransaction = branchActionClient
  .inputSchema(updateTransactionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId, branchId } = ctx;

    await db.insert(financeTransaction).values({
      ...parsedInput,
      organizationId,
      branchId,
    });
  });

export const deleteTransaction = branchActionClient
  .inputSchema(deleteTransactionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId, branchId } = ctx;

    await db
      .delete(financeTransaction)
      .where(
        and(
          eq(financeTransaction.id, parsedInput.id),
          eq(financeTransaction.organizationId, organizationId),
          eq(financeTransaction.branchId, branchId),
        ),
      );
  });
