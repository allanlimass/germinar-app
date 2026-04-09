import { AppSidebar } from "@/components/layout/app-sidebar";
import { BreadcrumbItem, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import React from "react";
import { eq } from "drizzle-orm";
import { organization } from "@/db/schema/auth";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const organizationId = session?.session?.activeOrganizationId;

  const organizationName = await db.query.organization.findFirst({
    where: eq(organization.id, organizationId),
    columns: {
      name: true,
    },
  });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
              {organizationName?.name}
            </BreadcrumbItem>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-6 pt-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
