"use server";

import { authClient } from "@/lib/safe-action";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils/services";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createOrganizationSchema } from "@/lib/validations/organization";

export const createOrganization = authClient
  .inputSchema(createOrganizationSchema)
  .action(async ({ parsedInput }) => {
    const name = parsedInput.name;
    const slug = slugify(parsedInput.name);

    const organization = await auth.api.createOrganization({
      body: {
        name,
        slug,
      },
      headers: await headers(),
    });

    if (!organization) {
      throw new Error("Erro ao criar organização");
    }

    const setActiveOrganization = await auth.api.setActiveOrganization({
      body: {
        organizationId: organization.id,
      },
      headers: await headers(),
    });

    if (!setActiveOrganization) {
      throw new Error("Erro ao definir organização ativa");
    }

    redirect("/organization");
  });
