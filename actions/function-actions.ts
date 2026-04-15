"use server";

import { actionClient } from "@/lib/safe-action/safe-action";
import { db } from "@/db";
import { churchFunction } from "@/db/schema/people";
import { and, eq } from "drizzle-orm";
import {
  createChurchFunctionSchema,
  updateChurchFunctionSchema,
  deleteChurchFunctionSchema,
} from "@/lib/validations/function";
import { revalidatePath } from "next/cache";

export const createChurchFunction = actionClient
  .inputSchema(createChurchFunctionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId } = ctx;

    revalidatePath("/organization/functions");

    await db.insert(churchFunction).values({ ...parsedInput, organizationId });
  });

export const updateChurchFunction = actionClient
  .inputSchema(updateChurchFunctionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId } = ctx;
    const { id, ...data } = parsedInput;

    revalidatePath("/organization/functions");

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

    revalidatePath("/organization/functions");

    await db
      .delete(churchFunction)
      .where(
        and(
          eq(churchFunction.id, id),
          eq(churchFunction.organizationId, organizationId),
        ),
      );
  });
