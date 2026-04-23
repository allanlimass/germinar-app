import { z } from "zod";

const nullableString = z
  .string()
  .trim()
  .nullable()
  .transform((value) => (value === "" || value === undefined ? null : value));

const churchMemberFormSchema = z.object({
  id: z.uuid(),
  userId: z.string().uuid().nullable(),
  churchPositionId: z.string().uuid().nullable().optional(),
  churchFunctionId: z.string().uuid().nullable().optional(),

  type: z.enum(["MEMBER", "VISITOR"]),

  photoUrl: nullableString,
  name: z.string().min(1, "Campo obrigatório"),
  birthDate: z.date().optional().nullable(),
  gender: z.enum(["MALE", "FEMALE"]),
  cpf: z
    .string()
    .trim()
    .nullable()
    .optional()
    .transform((value) => {
      if (!value) return null;
      return value.replace(/\D/g, "");
    })
    .refine((value) => value?.length === 11, { message: "CPF inválido" }),

  email: z.string().email("Endereço de email inválido").optional(),
  phone: z
    .string()
    .trim()
    .nullable()
    .transform((value) => {
      if (!value) return null;
      return value.replace(/\D/g, "");
    })
    .refine((value) => value?.length === 11, { message: "Telefone inválido" }),
  zipCode: nullableString,
  street: nullableString,
  number: nullableString,
  neighborhood: nullableString,
  complement: nullableString,
  city: nullableString,
  state: nullableString,

  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export const createChurchMemberSchema = churchMemberFormSchema.omit({
  id: true,
});
export const updateChurchMemberSchema = churchMemberFormSchema;
export const deleteChurchMemberSchema = churchMemberFormSchema.pick({
  id: true,
});

export type ChurchMemberFormSchema = z.infer<typeof churchMemberFormSchema>;
export type CreateChurchMemberSchema = z.infer<typeof createChurchMemberSchema>;
export type UpdateChurchMemberSchema = z.infer<typeof updateChurchMemberSchema>;
export type DeleteChurchMemberSchema = z.infer<typeof deleteChurchMemberSchema>;
