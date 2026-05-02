import PageLayout from "@/components/layout/page-layout";
import { PageLayoutActions } from "@/components/layout/page-layout-actions";

export default async function FinanceDashboardPage() {
  return (
    <PageLayout
      title="Financeiro"
      description="Gerencie as finanças da sua igreja"
      actions={<PageLayoutActions addButtonLabel="Novo Financeiro" />}
    >
      <h1>Finance Dashboard</h1>
    </PageLayout>
  );
}
