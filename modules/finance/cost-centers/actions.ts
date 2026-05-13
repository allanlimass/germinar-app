"use server";

import { branchActionClient } from "@/lib/safe-action";
import {
  createCostCenterSchema,
  updateCostCenterSchema,
  deleteCostCenterSchema,
} from "./schemas";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { financeCostCenter } from "@/db/schema/finance";
import { and, eq } from "drizzle-orm";

const path = (branchId: string) => `/branch/${branchId}/finance/cost-centers`;

export const createCostCenter = branchActionClient
  .inputSchema(createCostCenterSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId, branchId } = ctx;

    revalidatePath(path(branchId));

    await db.insert(financeCostCenter).values({
      organizationId,
      branchId,
      ...parsedInput,
    });
  });

export const updateCostCenter = branchActionClient
  .inputSchema(updateCostCenterSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId, branchId } = ctx;

    revalidatePath(path(branchId));

    await db
      .update(financeCostCenter)
      .set({ ...parsedInput })
      .where(
        and(
          eq(financeCostCenter.id, parsedInput.id),
          eq(financeCostCenter.organizationId, organizationId),
          eq(financeCostCenter.branchId, branchId),
        ),
      );
  });

export const deleteCostCenter = branchActionClient
  .inputSchema(deleteCostCenterSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId, branchId } = ctx;

    revalidatePath(path(branchId));

    await db
      .delete(financeCostCenter)
      .where(
        and(
          eq(financeCostCenter.id, parsedInput.id),
          eq(financeCostCenter.organizationId, organizationId),
          eq(financeCostCenter.branchId, branchId),
        ),
      );
  });
