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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  CreateOrganizationInput,
  createOrganizationSchema,
} from "@/lib/validations/organization";
import { createOrganization } from "@/actions/organization-actions";
import { useAction } from "next-safe-action/hooks";

export default function OrganizationForm() {
  const router = useRouter();

  const form = useForm<CreateOrganizationInput>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  const createOrganizationAction = useAction(createOrganization, {
    onSuccess: () => {
      toast.success("Organização criada com sucesso!");
      router.push("/organization");
    },
    onError: (ctx) => {
      console.error(ctx.error.serverError);
    },
  });

  const onSubmit = (data: CreateOrganizationInput) => {
    createOrganizationAction.execute(data);
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bem-vindo!</CardTitle>
          <CardDescription>Crie sua organização</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-4">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Nome da Organização
                    </FieldLabel>
                    <Input
                      id={field.name}
                      {...field}
                      placeholder="Digite o nome da organização"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <div className="flex flex-row justify-between gap-4">
                <Field>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleLogout}
                  >
                    Sair
                  </Button>
                </Field>

                <Field>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                    ) : (
                      "Criar"
                    )}
                  </Button>
                </Field>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
