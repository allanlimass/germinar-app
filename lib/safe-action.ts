import { createSafeActionClient } from "next-safe-action";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getLastAccesedBranch } from "./utils/branch-context";

export const authClient = createSafeActionClient().use(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Usuário não autenticado.");
  }

  return next({ ctx: { session } });
});

export const organizationActionClient = authClient.use(
  async ({ next, ctx }) => {
    const organizationId = ctx.session.session?.activeOrganizationId;

    if (!organizationId) {
      throw new Error("Usuário sem organização ativa.");
    }

    return next({ ctx: { ...ctx, organizationId } });
  },
);

export const branchActionClient = organizationActionClient.use(
  async ({ next, ctx }) => {
    const branchId = await getLastAccesedBranch();

    if (!branchId) {
      throw new Error("Usuário sem filial ativa.");
    }

    return next({ ctx: { ...ctx, branchId } });
  },
);
