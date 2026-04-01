"use server";

import { actionClient } from "@/lib/safe-action/safe-action";
import { db } from "@/db";
import { churchRole } from "@/db/schema/people";
import { and, eq } from "drizzle-orm";
import {
  insertChurchRoleSchema,
  updateChurchRoleSchema,
  deleteChurchRoleSchema,
} from "@/lib/validations/church-role";

export const createChurchRole = actionClient
  .inputSchema(insertChurchRoleSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId } = ctx;

    await db.insert(churchRole).values({ organizationId, ...parsedInput });
  });

export const updateChurchRole = actionClient
  .inputSchema(updateChurchRoleSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId } = ctx;
    const { id, ...data } = parsedInput;

    await db
      .update(churchRole)
      .set(data)
      .where(
        and(
          eq(churchRole.id, id),
          eq(churchRole.organizationId, organizationId),
        ),
      );
  });

export const deleteChurchRole = actionClient
  .inputSchema(deleteChurchRoleSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId } = ctx;
    const { id } = parsedInput;

    await db
      .delete(churchRole)
      .where(
        and(
          eq(churchRole.id, id),
          eq(churchRole.organizationId, organizationId),
        ),
      );
  });
