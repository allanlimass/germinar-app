import z from "zod";
import { financeTransaction } from "@/db/schema/finance";

const incomeBase = z.object({
  financeAccountId: z.string().uuid(),
  financeChartOfAccountId: z.string().uuid().optional(),
  financeCostCenterId: z.string().uuid().optional(),
  financeSupplierId: z.string().uuid().optional(),
  financeContributorId: z.string().uuid().optional(),
  type: z.enum(["income", "expense"]).default("income"),
  amount: z
    .number()
    .positive()
    .transform((value) => value.toString()),
  description: z.string().trim().optional(),
  dueDate: z.date().optional(),
  paymentDate: z.date().optional(),
  paymentMethod: z
    .enum([
      "credit_card",
      "debit_card",
      "cash",
      "check",
      "bank_slip",
      "pix",
      "transfer",
      "other",
    ])
    .optional(),
  status: z.enum(["pending", "paid", "overdue"]).default("pending"),
});

export const createIncomeSchema = incomeBase;
export const updateIncomeSchema = incomeBase.extend({
  id: z.string().uuid(),
});
export const deleteIncomeSchema = z.object({
  id: z.string().uuid(),
});

export type Income = typeof financeTransaction.$inferSelect;
export type CreateIncomeSchema = z.input<typeof createIncomeSchema>;
export type UpdateIncomeSchema = z.infer<typeof updateIncomeSchema>;
export type DeleteIncomeSchema = z.infer<typeof deleteIncomeSchema>;
