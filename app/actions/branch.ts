"use server";

import { actionClient } from "@/lib/safe-action";
import { branchFormSchema } from "@/validators/branch";
import { db } from "@/db";
import { branch } from "@/db/schema/organization";
import { branchMember } from "@/db/schema/organization";
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
  .action(async ({ parsedInput }) => {
    await db.delete(branch).where(eq(branch.id, parsedInput.id));

    return { success: true };
  });
