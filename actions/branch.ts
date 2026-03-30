"use server";

import { actionClient } from "@/lib/safe-action/safe-action";
import { branchFormSchema } from "@/types/organization";
import { db } from "@/db";
import { branch, branchMember } from "@/db/schema/organization";
import { and, eq } from "drizzle-orm";
import z from "zod";

export const createBranch = actionClient
  .inputSchema(branchFormSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId, session } = ctx;

    const [newBranch] = await db
      .insert(branch)
      .values({
        organizationId,
        ...parsedInput,
      })
      .returning();

    await db.insert(branchMember).values({
      branchId: newBranch.id,
      userId: session.user.id,
      role: "owner",
    });

    return { success: true };
  });

export const updateBranch = actionClient
  .inputSchema(branchFormSchema.extend({ id: z.string() }))
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId } = ctx;
    const { id, ...data } = parsedInput;

    const [updatedBranch] = await db
      .update(branch)
      .set(data)
      .where(and(eq(branch.id, id), eq(branch.organizationId, organizationId)))
      .returning();

    return { success: true, updatedBranch };
  });

export const deleteBranch = actionClient
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId } = ctx;
    await db
      .delete(branch)
      .where(
        and(
          eq(branch.id, parsedInput.id),
          eq(branch.organizationId, organizationId),
        ),
      );

    return { success: true };
  });
