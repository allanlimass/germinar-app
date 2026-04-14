"use server";

import { actionClient } from "@/lib/safe-action/safe-action";
import { db } from "@/db";
import { churchFunction } from "@/db/schema/people";
import { and, eq } from "drizzle-orm";
import {
  insertChurchFunctionSchema,
  updateChurchFunctionSchema,
  deleteChurchFunctionSchema,
} from "@/lib/validations/function";

export const createChurchFunction = actionClient
  .inputSchema(insertChurchFunctionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId } = ctx;

    await db.insert(churchFunction).values({ organizationId, ...parsedInput });
  });

export const updateChurchFunction = actionClient
  .inputSchema(updateChurchFunctionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId } = ctx;
    const { id, ...data } = parsedInput;

    await db
      .update(churchFunction)
      .set(data)
      .where(
        and(
          eq(churchFunction.id, id),
          eq(churchFunction.organizationId, organizationId),
        ),
      );
  });

export const deleteChurchFunction = actionClient
  .inputSchema(deleteChurchFunctionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId } = ctx;
    const { id } = parsedInput;

    await db
      .delete(churchFunction)
      .where(
        and(
          eq(churchFunction.id, id),
          eq(churchFunction.organizationId, organizationId),
        ),
      );
  });
