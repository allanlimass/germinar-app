import z from "zod";
import { financeSupplier } from "@/db/schema/finance";

const supplierBase = z.object({
  isCompany: z.boolean().default(false),
  name: z
    .string()
    .min(1, "Campo obrigatório")
    .max(255, "Deve conter no máximo 255 caracteres"),
  fantasyName: z
    .string()
    .max(255, "Deve conter no máximo 255 caracteres")
    .optional(),
  cpf: z.string().optional(),
  cnpj: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  zipCode: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  neighborhood: z.string().optional(),
  complement: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

export const createSupplierSchema = supplierBase;
export const updateSupplierSchema = supplierBase.extend({
  id: z.uuid(),
});
export const deleteSupplierSchema = z.object({
  id: z.uuid(),
});

export type Supplier = typeof financeSupplier.$inferSelect;
export type CreateSupplierSchema = z.input<typeof createSupplierSchema>;
export type UpdateSupplierSchema = z.infer<typeof updateSupplierSchema>;
export type DeleteSupplierSchema = z.infer<typeof deleteSupplierSchema>;
