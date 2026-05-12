"use server";

import { actionClient } from "@/lib/safe-action";
import {
  createCostCenterSchema,
  updateCostCenterSchema,
  deleteCostCenterSchema,
} from "@/lib/validations/cost-center";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { financeCostCenter } from "@/db/schema/finance";
import { and, eq } from "drizzle-orm";

export const createCostCenter = actionClient
  .inputSchema(createCostCenterSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId } = ctx;

    revalidatePath("/finance/cost-centers");

    await db.insert(financeCostCenter).values({
      organizationId,
      ...parsedInput,
    });
  });

export const updateCostCenter = actionClient
  .inputSchema(updateCostCenterSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId } = ctx;

    revalidatePath("/finance/cost-centers");

    await db
      .update(financeCostCenter)
      .set({ ...parsedInput })
      .where(
        and(
          eq(financeCostCenter.id, parsedInput.id),
          eq(financeCostCenter.organizationId, organizationId),
        ),
      );
  });

export const deleteCostCenter = actionClient
  .inputSchema(deleteCostCenterSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId } = ctx;

    revalidatePath("/finance/cost-centers");

    await db
      .delete(financeCostCenter)
      .where(
        and(
          eq(financeCostCenter.id, parsedInput.id),
          eq(financeCostCenter.organizationId, organizationId),
        ),
      );
  });
