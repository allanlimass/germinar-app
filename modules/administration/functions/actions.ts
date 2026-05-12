"use server";

import { branchActionClient } from "@/lib/safe-action";
import { db } from "@/db";
import { churchFunction } from "@/db/schema/people";
import { and, eq } from "drizzle-orm";
import {
  createChurchFunctionSchema,
  updateChurchFunctionSchema,
  deleteChurchFunctionSchema,
} from "./schemas";
import { revalidatePath } from "next/cache";

export const createChurchFunction = branchActionClient
  .inputSchema(createChurchFunctionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId, branchId } = ctx;

    revalidatePath(`/branch/${branchId}/administration/functions`);

    await db
      .insert(churchFunction)
      .values({ organizationId, branchId, ...parsedInput });
  });

export const updateChurchFunction = branchActionClient
  .inputSchema(updateChurchFunctionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId, branchId } = ctx;
    const { id, ...data } = parsedInput;

    revalidatePath(`/branch/${branchId}/administration/functions`);

    await db
      .update(churchFunction)
      .set(data)
      .where(
        and(
          eq(churchFunction.id, id),
          eq(churchFunction.branchId, branchId),
          eq(churchFunction.organizationId, organizationId),
        ),
      );
  });

export const deleteChurchFunction = branchActionClient
  .inputSchema(deleteChurchFunctionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId, branchId } = ctx;
    const { id } = parsedInput;

    revalidatePath(`/branch/${branchId}/administration/functions`);

    await db
      .delete(churchFunction)
      .where(
        and(
          eq(churchFunction.id, id),
          eq(churchFunction.branchId, branchId),
          eq(churchFunction.organizationId, organizationId),
        ),
      );
  });
