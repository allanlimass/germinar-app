"use server";

import { actionClient } from "@/lib/safe-action";
import { branchFormSchema } from "@/validators/branch";
import { db } from "../../db";
import { branch } from "../../db/schema/organization";
import { branchMember } from "../../db/schema/organization";

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
