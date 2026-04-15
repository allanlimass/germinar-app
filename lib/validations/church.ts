import { z } from "zod";

const formOptionalString = z
  .literal("")
  .transform(() => null)
  .or(z.string().nullable().optional());

const formOptionalEmail = z
  .literal("")
  .transform(() => null)
  .or(z.string().email().nullable().optional());

const dbOptionalString = z
  .string()
  .nullish()
  .transform((val) => val ?? null);
const dbOptionalEmail = z
  .email()
  .nullish()
  .transform((val) => val ?? null);

export const churchFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  logo: formOptionalString,

  type: z.enum(
    ["headquarters", "regional", "local"],
    "Selecione o tipo da unidade",
  ),

  cnpj: formOptionalString,
  email: formOptionalEmail,
  phone: formOptionalString,

  street: formOptionalString,
  number: formOptionalString,
  complement: formOptionalString,
  neighborhood: formOptionalString,
  city: formOptionalString,
  state: z
    .literal("")
    .transform(() => null)
    .or(
      z.string().max(2, "Use a sigla do estado (Ex: SP)").nullable().optional(),
    ),
  zipCode: formOptionalString,
});

export const churchDbSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  logo: dbOptionalString,

  type: z.enum(["headquarters", "regional", "local"]),

  cnpj: dbOptionalString,
  email: dbOptionalEmail,
  phone: dbOptionalString,

  street: dbOptionalString,
  number: dbOptionalString,
  complement: dbOptionalString,
  neighborhood: dbOptionalString,
  city: dbOptionalString,
  state: dbOptionalString,
  zipCode: dbOptionalString,

  path: dbOptionalString,
  metadata: dbOptionalString,
});

export const createChurchSchema = churchFormSchema.extend({
  parentId: formOptionalString,
  path: formOptionalString,
});

export const updateChurchSchema = churchFormSchema.extend({
  id: z.string(),
  path: formOptionalString,
});

export const deleteChurchSchema = z.object({
  id: z.string(),
});

export type ChurchDbSchema = z.infer<typeof churchDbSchema>;
export type CreateChurchInput = z.infer<typeof createChurchSchema>;
export type UpdateChurchInput = z.infer<typeof updateChurchSchema>;
export type DeleteChurchInput = z.infer<typeof deleteChurchSchema>;
