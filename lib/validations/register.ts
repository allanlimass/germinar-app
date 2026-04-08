import * as z from "zod";

export const registerSchema = z.object({
  firstName: z.string().trim().min(1, { message: "Nome é obrigatório" }),
  lastName: z.string().trim().min(1, { message: "Sobrenome é obrigatório" }),
  email: z
    .email({ message: "Email inválido" })
    .trim()
    .min(1, { message: "Email é obrigatório" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "Senha deve ter pelo menos 8 caracteres" }),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
