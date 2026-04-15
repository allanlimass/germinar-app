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
import z from "zod";

export const createChurchPosition = actionClient
  .inputSchema(createChurchPositionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId } = ctx;

    await db.insert(churchPosition).values({ ...parsedInput, organizationId });
  });

export const updateChurchPosition = actionClient
  .inputSchema(updateChurchPositionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId } = ctx;
    const { id, ...data } = parsedInput;

    return await db
      .update(churchPosition)
      .set(data)
      .where(
        and(
          eq(churchPosition.id, id),
          eq(churchPosition.organizationId, organizationId),
        ),
      )
      .returning();
  });

export const deleteChurchPosition = actionClient
  .inputSchema(deleteChurchPositionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId } = ctx;
    const { id } = parsedInput;

    await db
      .delete(churchPosition)
      .where(
        and(
          eq(churchPosition.id, id),
          eq(churchPosition.organizationId, organizationId),
        ),
      );
  });
