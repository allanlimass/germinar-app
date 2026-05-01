import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { listBranches } from "@/db/queries/branches";
import { getSessionContext } from "@/lib/utils/db-utils";

export default async function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, organizationId } = await getSessionContext();

  const user = session?.user;

  const branches = await listBranches(organizationId);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar user={user} branches={branches} />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 px-6 py-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
