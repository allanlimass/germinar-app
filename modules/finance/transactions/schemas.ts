import z from "zod";
import { financeTransaction } from "@/db/schema/finance";

const transactionBase = z.object({
  accountId: z.string().uuid().optional(),
  chartOfAccountId: z.string().uuid().optional(),
  costCenterId: z.string().uuid().optional(),
  supplierId: z.string().uuid().optional(),
  contributorId: z.string().uuid().optional(),
  type: z.enum(["income", "expense", "transfer"]),
  amount: z.number().positive(),
  description: z.string().trim().optional(),
  dueDate: z.date().optional(),
  paymentDate: z.date().optional(),
  status: z.enum(["pending", "paid", "overdue", "canceled"]).default("pending"),
  source: z.enum(["manual", "import", "gateway"]).default("manual"),
  externalId: z.string().optional(),
});

export const createTransactionSchema = transactionBase;
export const updateTransactionSchema = transactionBase.extend({
  id: z.string().uuid(),
});
export const deleteTransactionSchema = z.object({
  id: z.string().uuid(),
});

export type Transaction = z.infer<typeof financeTransaction>;
export type CreateTransactionSchema = z.input<typeof createTransactionSchema>;
export type UpdateTransactionSchema = z.infer<typeof updateTransactionSchema>;
export type DeleteTransactionSchema = z.infer<typeof deleteTransactionSchema>;
