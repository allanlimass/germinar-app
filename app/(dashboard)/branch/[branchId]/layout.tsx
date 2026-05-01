import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { listBranchesByUserId } from "@/db/queries/branches";
import { getBranchContext } from "@/lib/utils/db-utils";

export default async function BranchLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;
  const { session, organizationId } = await getBranchContext(branchId);

  const user = session?.user;

  const branches = await listBranchesByUserId(session?.user.id, organizationId);

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
