import { z } from "zod";

const FormSchema = z.object({
  birthDate: z.coerce.date().optional().nullable(),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .optional()
    .nullable()
    .transform((v) => (v === "" || !v ? null : v))
    .refine((v) => !v || z.string().email().safeParse(v).success, {
      message: "Endereço de email inválido",
    }),
});

type Output = z.output<typeof FormSchema>;
type Input = z.input<typeof FormSchema>;

const fn = (input: Input) => {};
declare const out: Output;
fn(out);
