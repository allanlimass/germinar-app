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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

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
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 px-6 py-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
