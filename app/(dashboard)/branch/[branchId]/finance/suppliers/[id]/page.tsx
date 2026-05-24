import { getSupplierById } from "@/modules/finance/suppliers/queries";
import { getBranchContext } from "@/lib/utils/db-utils";
import { UpsertSupplierForm } from "@/modules/finance/suppliers/_components/upsert-form";
import { notFound } from "next/navigation";

export default async function SupplierEditPage({
  params,
}: {
  params: Promise<{ branchId: string; id: string }>;
}) {
  const { branchId, id } = await params;
  const { organizationId } = await getBranchContext(branchId);

  const supplier = await getSupplierById(organizationId, branchId, id);

  if (!supplier) return notFound();

  return <UpsertSupplierForm initialData={supplier} branchId={branchId} />;
}
