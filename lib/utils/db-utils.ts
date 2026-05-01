import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { branchMember as branchMembers } from "@/db/schema/organization";

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

export const getBranchContext = cache(async (branchId: string) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  const organizationId = session.session?.activeOrganizationId;

  if (!organizationId) {
    redirect("/onboarding");
  }

  const branchMember = await db.query.branchMember.findFirst({
    where: and(
      eq(branchMembers.branchId, branchId),
      eq(branchMembers.userId, session.user.id),
    ),
  });

  if (!branchMember) {
    redirect("/organization");
  }

  return {
    session,
    organizationId,
    branchMember,
  };
});
