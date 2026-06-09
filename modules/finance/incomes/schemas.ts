import z from "zod";
import { financeTransaction } from "@/db/schema/finance";

const incomeBase = z
  .object({
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
      .nullable()
      .optional(),
    fines: z
      .number()
      .nonnegative()
      .transform((value) => value.toString())
      .optional(),
    fees: z
      .number()
      .nonnegative()
      .transform((value) => value.toString())
      .optional(),
    paidAmount: z
      .number()
      .positive()
      .transform((value) => value.toString())
      .optional(),
    recurrenceGroupId: z.string().uuid().optional(),
    recurrenceIndex: z.number().int().positive().optional(),
    periodicity: z.enum(["unique", "recorrent", "parcelled"]).default("unique"),
    periodicityRecurrenceFrequency: z
      .enum(["daily", "weekly", "monthly", "yearly"])
      .optional(),
    periodicityParcelledQuantity: z.number().int().positive().optional(),
    periodicityParcelledPeriod: z
      .enum(["daily", "weekly", "monthly", "yearly"])
      .optional(),
    periodicityParcelledSplit: z.boolean().optional(),
    status: z.enum(["pending", "paid", "overdue"]).default("pending"),
  })
  .superRefine((data, ctx) => {
    if (
      data.periodicity === "recorrent" &&
      !data.periodicityRecurrenceFrequency
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Frequência de recorrência é obrigatória",
        path: ["periodicityRecurrenceFrequency"],
      });
    }
    if (
      data.periodicity === "parcelled" &&
      !data.periodicityParcelledQuantity
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Quantidade de parcelas é obrigatória",
        path: ["periodicityParcelledQuantity"],
      });
    }
    if (data.periodicity === "parcelled" && !data.periodicityParcelledPeriod) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Período de parcelamento é obrigatório",
        path: ["periodicityParcelledPeriod"],
      });
    }
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
