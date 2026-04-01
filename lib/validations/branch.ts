import { z } from "zod";

export const branchFormSchema = z.object({
  isHeadquarter: z.boolean(),
  name: z.string().min(1, "Campo obrigatório"),
  cnpj: z.string().optional(),
  phone: z.string().optional(),
  email: z.email().optional().or(z.literal("")),
  zipCode: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

export const branchMemberFormSchema = z.object({
  branchId: z.string().min(1, "Campo obrigatório"),
  userId: z.string().min(1, "Campo obrigatório"),
  role: z.string().min(1, "Campo obrigatório"),
});
