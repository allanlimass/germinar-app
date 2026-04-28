"use server";

import { actionClient } from "@/lib/safe-action/safe-action";
import {
  createChurchSchema,
  updateChurchSchema,
  deleteChurchSchema,
} from "@/lib/validations/church";
import { db } from "@/db";
import { branch } from "@/db/schema/organization";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export const createChurchAction = actionClient
  .inputSchema(createChurchSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId } = ctx;

    const newId = randomUUID();

    const parentId =
      parsedInput.type === "headquarters" ? null : parsedInput.parentId;

    const path = parentId ? `${parentId}.${newId}` : newId;

    const [newChurch] = await db
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

    return newChurch;
  });

export const updateChurchAction = actionClient
  .inputSchema(updateChurchSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id, ...updateData } = parsedInput;

    if (!id) {
      throw new Error("ID da filial é obrigatório para atualização.");
    }

    // Matriz não pode ter parentId
    const parentId =
      updateData.type === "headquarters" ? null : updateData.parentId;

    const path = parentId ? `${parentId}.${id}` : id;

    const [updatedChurch] = await db
      .update(branch)
      .set({
        ...updateData,
        parentId,
        path,
      })
      .where(eq(branch.id, id))
      .returning({ id: branch.id });

    return updatedChurch;
  });

export const deleteChurchAction = actionClient
  .inputSchema(deleteChurchSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id } = parsedInput;

    if (!id) {
      throw new Error("ID da filial é obrigatório para exclusão.");
    }

    const deletedChurch = await db
      .delete(branch)
      .where(eq(branch.id, id))
      .returning({ id: branch.id });

    return deletedChurch;
  });
