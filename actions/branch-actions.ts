"use server";

import { actionClient } from "@/lib/safe-action/safe-action";
import {
  createBranchSchema,
  updateBranchSchema,
  deleteBranchSchema,
} from "@/lib/validations/branch";
import { db } from "@/db";
import { branch } from "@/db/schema/organization";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { branchMember } from "@/db/schema/organization";

export const createBranchAction = actionClient
  .inputSchema(createBranchSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId, session } = ctx;

    const newId = randomUUID();

    const parentId =
      parsedInput.type === "headquarters" ? null : parsedInput.parentId;

    const path = parentId ? `${parentId}.${newId}` : newId;

    const [newBranch] = await db
      .insert(branch)
      .values({
        ...parsedInput,
        id: newId,
        parentId,
        path,
        organizationId,
      })
      .returning({
        id: branch.id,
      });

    await db.insert(branchMember).values({
      userId: session.user.id,
      branchId: newBranch.id,
      role: "admin",
    });

    return newBranch;
  });

export const updateBranchAction = actionClient
  .inputSchema(updateBranchSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...updateData } = parsedInput;

    if (!id) {
      throw new Error("ID da filial é obrigatório para atualização.");
    }

    // Matriz não pode ter parentId
    const parentId =
      updateData.type === "headquarters" ? null : updateData.parentId;

    const path = parentId ? `${parentId}.${id}` : id;

    const [updatedBranch] = await db
      .update(branch)
      .set({
        ...updateData,
        parentId,
        path,
      })
      .where(eq(branch.id, id))
      .returning({ id: branch.id });

    return updatedBranch;
  });

export const deleteBranchAction = actionClient
  .inputSchema(deleteBranchSchema)
  .action(async ({ parsedInput }) => {
    const { id } = parsedInput;

    if (!id) {
      throw new Error("ID da filial é obrigatório para exclusão.");
    }

    const deletedBranch = await db
      .delete(branch)
      .where(eq(branch.id, id))
      .returning({ id: branch.id });

    return deletedBranch;
  });
