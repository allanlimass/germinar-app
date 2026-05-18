"use server";

import { branchActionClient } from "@/lib/safe-action";

import {
  createSupplierSchema,
  updateSupplierSchema,
  deleteSupplierSchema,
} from "./schemas";
import { db } from "@/db";
import { financeSupplier } from "@/db/schema/finance";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";

const path = (branchId: string) => `/branch/${branchId}/finance/suppliers`;

export const createSupplier = branchActionClient
  .inputSchema(createSupplierSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId, branchId } = ctx;

    await db.insert(financeSupplier).values({
      organizationId,
      branchId,
      ...parsedInput,
    });

    revalidatePath(path(branchId));
  });

export const updateSupplier = branchActionClient
  .inputSchema(updateSupplierSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId, branchId } = ctx;

    await db
      .update(financeSupplier)
      .set({ ...parsedInput })
      .where(
        and(
          eq(financeSupplier.id, parsedInput.id),
          eq(financeSupplier.organizationId, organizationId),
          eq(financeSupplier.branchId, branchId),
        ),
      );

    revalidatePath(path(branchId));
  });

export const deleteSupplier = branchActionClient
  .inputSchema(deleteSupplierSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId, branchId } = ctx;

    await db
      .delete(financeSupplier)
      .where(
        and(
          eq(financeSupplier.id, parsedInput.id),
          eq(financeSupplier.organizationId, organizationId),
          eq(financeSupplier.branchId, branchId),
        ),
      );

    revalidatePath(path(branchId));
  });
