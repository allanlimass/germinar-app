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
