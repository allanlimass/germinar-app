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
  FieldSeparator,
} from "@/components/ui/field";

import z from "zod";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EyeIcon, KeyRoundIcon, Loader2Icon, MailIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().trim().min(1, { message: "Email é obrigatório" }).email({
    message: "Email inválido",
  }),
  password: z.string().trim().min(8, {
    message: "Senha deve ter pelo menos 8 caracteres",
  }),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
        callbackURL: "/dashboard",
      },
      {
        onError: (ctx) => {
          if (ctx.error.code === "INVALID_EMAIL_OR_PASSWORD") {
            toast.error("Email ou senha inválidos.");
            return;
          }
          toast.error("Erro ao realizar login.");
        },
        onSuccess: () => {
          router.push("/dashboard");
        },
      },
    );
  };

  const handleGoogleLogin = async () => {
    await authClient.signIn.social(
      {
        provider: "google",
        callbackURL: "/dashboard",
      },
      {
        onError: (ctx) => {
          toast.error("Erro ao realizar login com Google.");
        },
        onSuccess: () => {
          router.push("/dashboard");
        },
      },
    );
  };

  return (
    <div className={"flex flex-col gap-6"}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bem-vindo de volta!</CardTitle>
          <CardDescription>Faça login com sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-4">
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleGoogleLogin}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login com Google
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                ou
              </FieldSeparator>

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
              <div className="flex items-center justify-between">
                <Controller
                  name="rememberMe"
                  control={form.control}
                  render={({ field }) => (
                    <Field orientation="horizontal">
                      <Checkbox
                        id={field.name}
                        name={field.name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <FieldLabel htmlFor={field.name} className="font-normal">
                        Lembre-se de mim
                      </FieldLabel>
                    </Field>
                  )}
                />
                <Link
                  href="/forgot-password"
                  className="text-sm underline-offset-4 hover:underline"
                >
                  Esqueceu sua senha?
                </Link>
              </div>
              <Field className="flex flex-col gap-4">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  ) : (
                    "Login"
                  )}
                </Button>

                <FieldDescription className="text-center">
                  Não tem uma conta? <a href="/register">Registre-se</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Ao clicar em continuar, você concorda com nossos{" "}
        <Link href="#">Termos de Serviço</Link> e{" "}
        <Link href="#">Política de Privacidade</Link>.
      </FieldDescription>
    </div>
  );
}
