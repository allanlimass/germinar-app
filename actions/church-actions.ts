"use server";

import { actionClient } from "@/lib/safe-action/safe-action";
import {
  createChurchSchema,
  updateChurchSchema,
  deleteChurchSchema,
} from "@/lib/validations/organization";
import { slugify } from "@/lib/utils/services";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import z from "zod";
import { getSessionContext } from "@/lib/utils/db-utils";

export const createChurchAction = actionClient
  .inputSchema(createChurchSchema)
  .action(async ({ parsedInput }) => {
    const { organizationId: previousOrgId } = await getSessionContext();

    const slug = slugify(parsedInput.name);
    const organization = await auth.api.createOrganization({
      body: {
        ...parsedInput,
        slug,
      },
      headers: await headers(),
    });

    const path = parsedInput.parentId
      ? parsedInput.parentId + "." + organization.id
      : organization.id;

    await auth.api.updateOrganization({
      body: {
        organizationId: organization.id,
        data: {
          slug,
          path,
        },
      },
      headers: await headers(),
    });

    await auth.api.setActiveOrganization({
      body: {
        organizationId: previousOrgId,
      },
      headers: await headers(),
    });

    return { success: true, id: organization.id };
  });

export const updateChurchAction = actionClient
  .inputSchema(updateChurchSchema)
  .action(async ({ parsedInput }) => {
    const { id, path, ...data } = parsedInput;
    const slug = slugify(data.name);
    await auth.api.updateOrganization({
      body: {
        organizationId: id,
        data: {
          ...data,
          slug,
          path,
        },
      },
      headers: await headers(),
    });

    return { success: true };
  });

export const deleteChurchAction = actionClient
  .inputSchema(deleteChurchSchema)
  .action(async ({ parsedInput }) => {
    await auth.api.deleteOrganization({
      body: {
        organizationId: parsedInput.id,
      },
      headers: await headers(),
    });

    return { success: true };
  });

export const setActiveChurchAction = actionClient
  .inputSchema(z.object({ organizationId: z.string() }))
  .action(async ({ parsedInput }) => {
    await auth.api.setActiveOrganization({
      body: {
        organizationId: parsedInput.organizationId,
      },
      headers: await headers(),
    });

    return { success: true };
  });
