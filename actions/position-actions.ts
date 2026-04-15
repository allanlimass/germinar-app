"use server";

import { actionClient } from "@/lib/safe-action/safe-action";
import { db } from "@/db";
import { churchPosition } from "@/db/schema/people";
import { and, eq } from "drizzle-orm";
import {
  createChurchPositionSchema,
  updateChurchPositionSchema,
  deleteChurchPositionSchema,
} from "@/lib/validations/position";
import { revalidatePath } from "next/cache";

export const createChurchPosition = actionClient
  .inputSchema(createChurchPositionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId } = ctx;

    revalidatePath("/organization/positions");

    await db.insert(churchPosition).values({ ...parsedInput, organizationId });
  });

export const updateChurchPosition = actionClient
  .inputSchema(updateChurchPositionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId } = ctx;
    const { id, ...data } = parsedInput;

    revalidatePath("/organization/positions");

    await db
      .update(churchPosition)
      .set(data)
      .where(
        and(
          eq(churchPosition.id, id),
          eq(churchPosition.organizationId, organizationId),
        ),
      );
  });

export const deleteChurchPosition = actionClient
  .inputSchema(deleteChurchPositionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId } = ctx;
    const { id } = parsedInput;

    revalidatePath("/organization/positions");

    await db
      .delete(churchPosition)
      .where(
        and(
          eq(churchPosition.id, id),
          eq(churchPosition.organizationId, organizationId),
        ),
      );
  });
