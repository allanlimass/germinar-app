import { GalleryVerticalEnd } from "lucide-react";

import { RegisterForm } from "./_components/register-form";
import { db } from "@/db";
import { invitation } from "@/db/schema/auth";
import { eq } from "drizzle-orm";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: { invitationId?: string };
}) {
  const { invitationId } = await searchParams;

  const result = await db.query.invitation.findFirst({
    where: eq(invitation.id, invitationId || ""),
  });

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Germinar
        </a>
        <RegisterForm
          invitationId={invitationId}
          email={result?.email}
          status={result?.status}
        />
      </div>
    </div>
  );
}
