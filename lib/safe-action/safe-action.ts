import { createSafeActionClient } from "next-safe-action";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const authActionClient = createSafeActionClient().use(
  async ({ next }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Usuário não autenticado.");
    }

    return next({ ctx: { session } });
  },
);

export const actionClient = authActionClient.use(async ({ next, ctx }) => {
  const organizationId = ctx.session.session?.activeOrganizationId;

  if (!organizationId) {
    throw new Error("Usuário sem organização ativa.");
  }

  return next({ ctx: { ...ctx, organizationId } });
});
