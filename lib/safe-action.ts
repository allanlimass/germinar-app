import { createSafeActionClient } from "next-safe-action";
import { auth } from "./auth";
import { headers } from "next/headers";

export const actionClient = createSafeActionClient().use(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Usuário não autenticado.");
  }

  const organizationId = session.session?.activeOrganizationId;

  if (!organizationId) {
    throw new Error("Usuário sem organização ativa.");
  }

  return next({ ctx: { session, organizationId } });
});
