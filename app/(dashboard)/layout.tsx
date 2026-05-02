import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getUserBranches } from "@/db/queries/branch";
import { auth } from "@/lib/auth";
import { getLastAccesedBranch } from "@/lib/utils/branch-context";
import { getSessionContext } from "@/lib/utils/db-utils";
import { headers } from "next/headers";
import React from "react";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = await getSessionContext();

  const user = session.user;

  const role = await auth.api.getActiveMemberRole({ headers: await headers() });

  const activeBranchId = await getLastAccesedBranch();

  const branches = await getUserBranches(user.id);
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        user={user}
        role={role}
        activeBranchId={activeBranchId}
        branches={branches}
      />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 px-6 py-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
