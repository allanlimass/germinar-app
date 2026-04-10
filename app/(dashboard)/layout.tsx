import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import React from "react";
import { getSessionContext } from "@/lib/utils/db-utils";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { organizationId } = await getSessionContext();

  const churches = await auth.api.listOrganizations({
    headers: await headers(),
  });

  return (
    <SidebarProvider>
      <AppSidebar churches={churches} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-6 pt-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
