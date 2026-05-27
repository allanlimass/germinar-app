"use server";

import { branchActionClient } from "@/lib/safe-action";
import {
  createAccountSchema,
  deleteAccountSchema,
  updateAccountSchema,
} from "./schemas";
import { db } from "@/db";
import { financeAccount } from "@/db/schema/finance";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";

const path = (branchId: string) => `/branch/${branchId}/finance/accounts`;

export const createAccount = branchActionClient
  .inputSchema(createAccountSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId, branchId } = ctx;

    await db.insert(financeAccount).values({
      organizationId,
      branchId,
      ...parsedInput,
    });

    revalidatePath(path(branchId));
  });

export const updateAccount = branchActionClient
  .inputSchema(updateAccountSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId, branchId } = ctx;
    const { id, ...input } = parsedInput;

    await db
      .update(financeAccount)
      .set(input)
      .where(
        and(
          eq(financeAccount.organizationId, organizationId),
          eq(financeAccount.branchId, branchId),
          eq(financeAccount.id, id),
        ),
      );

    revalidatePath(path(branchId));
  });

export const deleteAccount = branchActionClient
  .inputSchema(deleteAccountSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId, branchId } = ctx;
    const { id } = parsedInput;

    await db
      .delete(financeAccount)
      .where(
        and(
          eq(financeAccount.organizationId, organizationId),
          eq(financeAccount.branchId, branchId),
          eq(financeAccount.id, id),
        ),
      );

    revalidatePath(path(branchId));
  });
