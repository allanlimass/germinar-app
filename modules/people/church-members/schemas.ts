import { z } from "zod";
import { churchMember } from "@/db/schema/people";

const nullableString = z
  .string()
  .trim()
  .nullable()
  .transform((value) => (value === "" || value === undefined ? null : value));

const churchMemberBase = z.object({
  userId: z.string().uuid().nullable(),
  churchPositionId: z.string().uuid().nullable().optional(),
  churchFunctionId: z.string().uuid().nullable().optional(),

  type: z.enum(["member", "visitor"]),

  photoUrl: nullableString,
  name: z.string().min(1, "Campo obrigatório"),
  birthDate: z.date().optional().nullable(),
  gender: z.enum(["male", "female"]),
  cpf: z
    .string()
    .trim()
    .nullable()
    .optional()
    .transform((value) => {
      if (!value) return null;
      return value.replace(/\D/g, "");
    })
    .refine((value) => !value || value.length === 11, {
      message: "CPF inválido",
    }),

  email: z
    .string()
    .trim()
    .nullable()
    .optional()
    .transform((value) => (value === "" || !value ? null : value))
    .refine((value) => !value || z.string().email().safeParse(value).success, {
      message: "Email inválido",
    }),
  phone: z
    .string()
    .trim()
    .nullable()
    .optional()
    .transform((value) => {
      if (!value) return null;
      return value.replace(/\D/g, "");
    })
    .refine((value) => !value || value.length === 11, {
      message: "Telefone inválido",
    }),
  zipCode: nullableString,
  street: nullableString,
  number: nullableString,
  neighborhood: nullableString,
  complement: nullableString,
  city: nullableString,
  state: nullableString,

  status: z.enum(["active", "inactive"]),
});

export const createChurchMemberSchema = churchMemberBase;
export const updateChurchMemberSchema = churchMemberBase.extend({
  id: z.uuid(),
});
export const deleteChurchMemberSchema = z.object({
  id: z.uuid(),
});

export type ChurchMember = typeof churchMember.$inferSelect;
export type CreateChurchMemberSchema = z.input<typeof createChurchMemberSchema>;
export type UpdateChurchMemberSchema = z.infer<typeof updateChurchMemberSchema>;
export type DeleteChurchMemberSchema = z.infer<typeof deleteChurchMemberSchema>;
