import { z } from "zod";
import { branch } from "@/db/schema/organization";

export type Branch = typeof branch.$inferSelect;

const branchBase = z.object({
  parentId: z
    .string()
    .nullish()
    .transform((v) => (v === "" ? null : v)),
  type: z.enum(["headquarters", "regional", "local"]),

  logoUrl: z
    .string()
    .nullish()
    .transform((v) => (v === "" ? null : v)),
  name: z.string().min(1, "Campo obrigatório."),
  cnpj: z
    .string()
    .nullish()
    .transform((v) => (v === "" ? null : v)),
  phone: z
    .string()
    .nullish()
    .transform((v) => (v === "" ? null : v)),
  email: z
    .string()
    .nullish()
    .transform((v) => (v === "" ? null : v)),

  zipCode: z
    .string()
    .nullish()
    .transform((v) => (v === "" ? null : v)),
  street: z
    .string()
    .nullish()
    .transform((v) => (v === "" ? null : v)),
  number: z
    .string()
    .nullish()
    .transform((v) => (v === "" ? null : v)),
  complement: z
    .string()
    .nullish()
    .transform((v) => (v === "" ? null : v)),
  neighborhood: z
    .string()
    .nullish()
    .transform((v) => (v === "" ? null : v)),
  city: z
    .string()
    .nullish()
    .transform((v) => (v === "" ? null : v)),
  state: z
    .string()
    .nullish()
    .transform((v) => (v === "" ? null : v)),
});

export const createBranchSchema = branchBase;

export const updateBranchSchema = branchBase.extend({
  id: z.uuid(),
});

export const deleteBranchSchema = z.object({
  id: z.uuid(),
});

export type CreateBranchInput = z.input<typeof createBranchSchema>;
export type UpdateBranchInput = z.infer<typeof updateBranchSchema>;
export type DeleteBranchInput = z.infer<typeof deleteBranchSchema>;
