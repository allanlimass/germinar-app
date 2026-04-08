"use client";

import { useEffect, useState } from "react";
import OrganizationForm from "./_components/organization-form";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";

export default function WelcomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkOrganizations() {
      try {
        const { data: orgs } = await authClient.organization.list();

        if (orgs && orgs.length > 0) {
          await authClient.organization.setActive({
            organizationId: orgs[0].id,
          });
          router.push("/organization");
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Erro ao checar organizações", error);
        setIsLoading(false);
      }
    }

    checkOrganizations();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2Icon className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <OrganizationForm />;
}
