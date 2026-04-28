"use server";

import { authActionClient } from "@/lib/safe-action/safe-action";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils/services";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createChurchSchema } from "@/lib/validations/church";

export const createOrganization = authActionClient
  .inputSchema(createChurchSchema)
  .action(async ({ parsedInput }) => {
    const name = parsedInput.name;
    const slug = slugify(parsedInput.name);

    console.log("Creating organization with name and slug", name, slug);

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
