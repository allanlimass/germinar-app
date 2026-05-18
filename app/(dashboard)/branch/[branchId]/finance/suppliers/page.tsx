import { DataTable } from "@/components/data-table";
import { getSuppliers } from "@/modules/finance/suppliers/queries";
import { supplierColumns } from "@/modules/finance/suppliers/_components/columns";
import { getBranchContext } from "@/lib/utils/db-utils";
import PageLayout from "@/components/layout/page-layout";
import { PageLayoutActions } from "@/components/layout/page-layout-actions";

export default async function SuppliersPage({
  params,
}: {
  params: Promise<{ branchId: string }>;
}) {
  const { branchId } = await params;
  const { organizationId } = await getBranchContext(branchId);
  const suppliers = await getSuppliers(organizationId, branchId);

  return (
    <div>
      <PageLayout
        title="Fornecedores"
        description="Gerencie os fornecedores da sua igreja"
        actions={<PageLayoutActions addButtonLabel="Novo Fornecedor" />}
      >
        <DataTable data={suppliers} columns={supplierColumns} />
      </PageLayout>
    </div>
  );
}
