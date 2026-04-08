import { invitation } from "@/db/schema/auth";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { InvitationForm } from "../_components/invitation-form";

export default async function AcceptInvitationPage({
  params,
}: {
  params: Promise<{ invitationId?: string }>;
}) {
  const { invitationId } = await params;

  const result = await db.query.invitation.findFirst({
    where: eq(invitation.id, invitationId || ""),
    with: {
      organization: true,
    },
  });

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect(`/register?invitationId=${invitationId}`);
  }

  return <InvitationForm result={result!} />;
}
