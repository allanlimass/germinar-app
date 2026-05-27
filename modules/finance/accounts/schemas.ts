import { z } from "zod";
import { financeAccount, bank } from "@/db/schema/finance";

const accountBase = z.object({
  bankId: z.number().nullable().optional(),
  name: z.string().trim().min(1, "Campo obrigatório"),
  agency: z
    .string()
    .trim()
    .regex(/^[\d]*$/)
    .optional(),
  account: z
    .string()
    .trim()
    .regex(/^[\d]*$/)
    .optional(),
  type: z.enum(["checking", "savings", "cash"]),
});

export const createAccountSchema = accountBase.superRefine((data, ctx) => {
  if (data.type !== "cash") {
    if (!data.bankId)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Banco é obrigatório",
        path: ["bankId"],
      });

    if (!data.account)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Conta é obrigatória",
        path: ["account"],
      });

    if (!data.agency)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Agência é obrigatória",
        path: ["agency"],
      });
  }
});
export const updateAccountSchema = accountBase
  .extend({
    id: z.string().uuid("UUID inválido"),
  })
  .and(createAccountSchema);
export const deleteAccountSchema = z.object({
  id: z.string().uuid("UUID inválido"),
});

export type Account = typeof financeAccount.$inferSelect;
export type Bank = typeof bank.$inferSelect;
export type AccountWithBank = Account & {
  bank: Bank | null;
};
export type CreateAccountSchema = z.input<typeof createAccountSchema>;
export type UpdateAccountSchema = z.infer<typeof updateAccountSchema>;
export type DeleteAccountSchema = z.infer<typeof deleteAccountSchema>;
