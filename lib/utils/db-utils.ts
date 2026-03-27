import { headers } from "next/headers";
import { auth } from "../auth";

export const getSessionContext = async () => {
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

  return { session, organizationId };
};
