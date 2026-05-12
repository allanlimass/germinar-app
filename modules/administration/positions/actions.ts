"use server";

import { branchActionClient } from "@/lib/safe-action";
import { db } from "@/db";
import { churchPosition } from "@/db/schema/people";
import { and, eq } from "drizzle-orm";
import {
  createChurchPositionSchema,
  updateChurchPositionSchema,
  deleteChurchPositionSchema,
} from "./schemas";
import { revalidatePath } from "next/cache";

export const createChurchPosition = branchActionClient
  .inputSchema(createChurchPositionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId, branchId } = ctx;

    revalidatePath(`/branch/${branchId}/administration/positions`);

    await db
      .insert(churchPosition)
      .values({ organizationId, branchId, ...parsedInput });
  });

export const updateChurchPosition = branchActionClient
  .inputSchema(updateChurchPositionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId, branchId } = ctx;
    const { id, ...data } = parsedInput;

    revalidatePath(`/branch/${branchId}/administration/positions`);

    await db
      .update(churchPosition)
      .set(data)
      .where(
        and(
          eq(churchPosition.id, id),
          eq(churchPosition.branchId, branchId),
          eq(churchPosition.organizationId, organizationId),
        ),
      );
  });

export const deleteChurchPosition = branchActionClient
  .inputSchema(deleteChurchPositionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId, branchId } = ctx;
    const { id } = parsedInput;

    revalidatePath(`/branch/${branchId}/administration/positions`);

    await db
      .delete(churchPosition)
      .where(
        and(
          eq(churchPosition.id, id),
          eq(churchPosition.branchId, branchId),
          eq(churchPosition.organizationId, organizationId),
        ),
      );
  });
