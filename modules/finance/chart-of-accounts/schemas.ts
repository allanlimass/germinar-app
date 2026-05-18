import { z } from "zod";
import { financeChartOfAccounts } from "@/db/schema/finance";

const chartOfAccountsFormSchema = z.object({
  parentId: z.uuid().nullable().optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.enum(["expense", "income"]),
});

export const createChartOfAccountsSchema = chartOfAccountsFormSchema;
export const updateChartOfAccountsSchema = chartOfAccountsFormSchema.extend({
  id: z.uuid(),
});
export const deleteChartOfAccountsSchema = z.object({
  id: z.uuid(),
});

export type ChartOfAccounts = typeof financeChartOfAccounts.$inferSelect;
export type CreateChartOfAccountsSchema = z.input<
  typeof createChartOfAccountsSchema
>;
export type UpdateChartOfAccountsSchema = z.infer<
  typeof updateChartOfAccountsSchema
>;
export type DeleteChartOfAccountSchema = z.infer<
  typeof deleteChartOfAccountsSchema
>;
