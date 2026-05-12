"use server";

import { db } from "@/db";
import { churchMember } from "@/db/schema/people";
import { branchActionClient } from "@/lib/safe-action";
import {
  deleteChurchMemberSchema,
  createChurchMemberSchema,
  updateChurchMemberSchema,
} from "./schemas";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const createChurchMember = branchActionClient
  .inputSchema(createChurchMemberSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId, branchId } = ctx;

    revalidatePath(`/branch/${branchId}/people/members`);

    await db
      .insert(churchMember)
      .values({ organizationId, branchId, ...parsedInput });
  });

export const updateChurchMember = branchActionClient
  .inputSchema(updateChurchMemberSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId, branchId } = ctx;
    const { id, ...data } = parsedInput;

    revalidatePath(`/branch/${branchId}/people/members`);

    await db
      .update(churchMember)
      .set(data)
      .where(
        and(
          eq(churchMember.id, id),
          eq(churchMember.branchId, branchId),
          eq(churchMember.organizationId, organizationId),
        ),
      );
  });

export const deleteChurchMember = branchActionClient
  .inputSchema(deleteChurchMemberSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { organizationId, branchId } = ctx;
    const { id } = parsedInput;

    revalidatePath(`/branch/${branchId}/people/members`);

    await db
      .delete(churchMember)
      .where(
        and(
          eq(churchMember.id, id),
          eq(churchMember.branchId, branchId),
          eq(churchMember.organizationId, organizationId),
        ),
      );
  });
