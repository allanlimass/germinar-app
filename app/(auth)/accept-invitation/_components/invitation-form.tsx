"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GalleryVerticalEnd } from "lucide-react";
import { invitation, organization } from "@/db/schema/auth";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

interface InvitationFormProps {
  result: typeof invitation.$inferSelect & {
    organization: typeof organization.$inferSelect;
  };
}

export function InvitationForm({ result }: InvitationFormProps) {
  const router = useRouter();

  const handleAcceptInvitation = async () => {
    await authClient.organization.acceptInvitation(
      {
        invitationId: result?.id || "",
      },
      {
        onSuccess: () => {
          router.push("/organization");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      },
    );
  };

  const handleRejectInvitation = async () => {
    await authClient.organization.rejectInvitation(
      {
        invitationId: result?.id || "",
      },
      {
        onSuccess: () => {
          router.push("/register");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      },
    );
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Germinar
        </a>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              Deseja ingressar na organização <b>{result?.organization.name}</b>
              ?
            </CardTitle>
            <CardDescription>
              Convite enviado por {result?.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button type="button" onClick={handleAcceptInvitation}>
              Aceitar convite
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleRejectInvitation}
            >
              Recusar convite
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
