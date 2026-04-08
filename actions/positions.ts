"use server";

import { actionClient } from "@/lib/safe-action/safe-action";
import { db } from "@/db";
import { churchPosition } from "@/db/schema/people";
import { and, eq } from "drizzle-orm";
import {
  insertChurchPositionSchema,
  updateChurchPositionSchema,
  deleteChurchPositionSchema,
} from "@/lib/validations/position";

export const createChurchPosition = actionClient
  .inputSchema(insertChurchPositionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId } = ctx;

    await db.insert(churchPosition).values({ organizationId, ...parsedInput });
  });

export const updateChurchPosition = actionClient
  .inputSchema(updateChurchPositionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId } = ctx;
    const { id, ...data } = parsedInput;

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

    await db
      .delete(churchPosition)
      .where(
        and(
          eq(churchPosition.id, id),
          eq(churchPosition.organizationId, organizationId),
        ),
      );
  });
