import { z } from "zod";

export const chartOfAccountFormSchema = z.object({
  id: z.string().uuid(),
  parentId: z.string().uuid().nullable().optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.enum(["EXPENSE", "INCOME"]),
});

export const createChartOfAccountSchema = chartOfAccountFormSchema.omit({
  id: true,
});

export const updateChartOfAccountSchema = chartOfAccountFormSchema;

export const deleteChartOfAccountSchema = chartOfAccountFormSchema.pick({
  id: true,
});

export type ChartOfAccountFormSchema = z.infer<typeof chartOfAccountFormSchema>;
export type CreateChartOfAccountInput = z.infer<
  typeof createChartOfAccountSchema
>;
export type UpdateChartOfAccountInput = z.infer<
  typeof updateChartOfAccountSchema
>;
export type DeleteChartOfAccountInput = z.infer<
  typeof deleteChartOfAccountSchema
>;
