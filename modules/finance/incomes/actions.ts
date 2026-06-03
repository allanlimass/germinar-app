"use server";

import { branchActionClient } from "@/lib/safe-action";
import {
  createIncomeSchema,
  deleteIncomeSchema,
  updateIncomeSchema,
} from "./schemas";
import { db } from "@/db";
import { financeTransaction } from "@/db/schema/finance";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const path = (branchId: string) => `/branch/${branchId}/finance/incomes`;

export const createIncome = branchActionClient
  .inputSchema(createIncomeSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId, branchId } = ctx;

    await db.insert(financeTransaction).values({
      ...parsedInput,
      organizationId,
      branchId,
      createdBy: ctx.session.user.id,
    });

    revalidatePath(path(branchId));
  });

export const updateIncome = branchActionClient
  .inputSchema(updateIncomeSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId, branchId } = ctx;

    await db.insert(financeTransaction).values({
      ...parsedInput,
      organizationId,
      branchId,
      createdBy: ctx.session.user.id,
    });

    revalidatePath(path(branchId));
  });

export const deleteIncome = branchActionClient
  .inputSchema(deleteIncomeSchema)
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

    revalidatePath(path(branchId));
  });
