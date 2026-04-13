import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getSessionContext = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const organizationId = session.session?.activeOrganizationId;

  if (!organizationId) {
    redirect("/onboarding");
  }

  return { session, organizationId };
});

export const getOrganizationsContext = cache(async () => {
  const listChurches = await auth.api.listOrganizations({
    headers: await headers(),
  });

  const churches = listChurches.map((church) => ({
    id: church.id,
    name: church.name,
    type: church.type,
    logo: church.logo || undefined,
  }));

  return { churches };
});
