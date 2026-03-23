"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import * as z from "zod";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import {
  EyeIcon,
  KeyRoundIcon,
  Loader2Icon,
  MailIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";

const registerSchema = z.object({
  firstName: z.string().trim().min(1, { message: "Nome é obrigatório" }),
  lastName: z.string().trim().min(1, { message: "Sobrenome é obrigatório" }),
  email: z.string().trim().min(1, { message: "Email é obrigatório" }).email({
    message: "Email inválido",
  }),
  password: z.string().trim().min(8, {
    message: "Senha deve ter pelo menos 8 caracteres",
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    await authClient.signUp.email(
      {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        callbackURL: "/dashboard",
      },
      {
        onError: (ctx) => {
          if (ctx.error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
            toast.error("Usuário já cadastrado. Use outro e-mail");
            return;
          }
          toast.error("Erro ao criar conta.");
        },
        onSuccess: () => {
          toast.success("Conta criada com sucesso!");
          router.push("/dashboard");
        },
      },
    );
  };

  return (
    <div className={"flex flex-col gap-4"}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Registre-se</CardTitle>
          <CardDescription>Registre-se com sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-4">
              <Controller
                name="firstName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Nome</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id={field.name}
                        type="text"
                        placeholder="Seu primeiro nome"
                        required
                        {...field}
                      />
                      <InputGroupAddon>
                        <UserIcon />
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="lastName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Sobrenome</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id={field.name}
                        type="text"
                        placeholder="Seu sobrenome"
                        required
                        {...field}
                      />
                      <InputGroupAddon>
                        <UserIcon />
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id={field.name}
                        type="email"
                        placeholder="Digite seu email"
                        required
                        {...field}
                      />
                      <InputGroupAddon>
                        <MailIcon />
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor={field.name}>Senha</FieldLabel>
                    </div>
                    <InputGroup>
                      <InputGroupInput
                        id={field.name}
                        type="password"
                        placeholder="Digite sua senha"
                        required
                        {...field}
                      />
                      <InputGroupAddon>
                        <KeyRoundIcon />
                      </InputGroupAddon>
                      <InputGroupButton>
                        <EyeIcon />
                      </InputGroupButton>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Field>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  ) : (
                    "Registrar"
                  )}
                </Button>
                <FieldDescription className="text-center">
                  Já tem uma conta? <Link href="/login">Faça login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Ao clicar em registrar, você concorda com nossos{" "}
        <Link href="#">Termos de Serviço</Link> e{" "}
        <Link href="#">Política de Privacidade</Link>.
      </FieldDescription>
    </div>
  );
}
