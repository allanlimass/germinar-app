import { z } from "zod";

export const branchFormSchema = z.object({
  isHeadquarter: z.boolean(),
  name: z.string().min(3, "Campo obrigatório"),
  cnpj: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  zipCode: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});
