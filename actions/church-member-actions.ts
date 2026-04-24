"use server";

import { db } from "@/db";
import { churchMember } from "@/db/schema/people";
import { actionClient } from "@/lib/safe-action/safe-action";
import {
  deleteChurchMemberSchema,
  createChurchMemberSchema,
  updateChurchMemberSchema,
} from "@/lib/validations/church-member";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const createChurchMember = actionClient
  .inputSchema(createChurchMemberSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId } = ctx;

    revalidatePath("/people/members");

    await db.insert(churchMember).values({ ...parsedInput, organizationId });
  });

export const updateChurchMember = actionClient
  .inputSchema(updateChurchMemberSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId } = ctx;
    const { id, ...data } = parsedInput;

    revalidatePath("/people/members");

    await db
      .update(churchMember)
      .set(data)
      .where(
        and(
          eq(churchMember.id, id),
          eq(churchMember.organizationId, organizationId),
        ),
      );
  });

export const deleteChurchMember = actionClient
  .inputSchema(deleteChurchMemberSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId } = ctx;
    const { id } = parsedInput;

    revalidatePath("/people/members");

    await db
      .delete(churchMember)
      .where(
        and(
          eq(churchMember.id, id),
          eq(churchMember.organizationId, organizationId),
        ),
      );
  });
