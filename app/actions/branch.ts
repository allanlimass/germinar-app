"use server";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";
import { branchFormSchema } from "@/validators/branch";
import { headers } from "next/headers";
import { db } from "../db";
import { branch } from "../db/schema/organization";
import { branchMember } from "../db/schema/organization";

export const createBranch = actionClient
  .schema(branchFormSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Sessão não encontrada." };
    }

    const { name, organizationId } = parsedInput;

    const [newBranch] = await db
      .insert(branch)
      .values({
        name,
        organizationId,
      })
      .returning();

    await db.insert(branchMember).values({
      branchId: newBranch.id,
      userId: session.user.id,
      role: "owner",
    });

    return { success: true };
  });
