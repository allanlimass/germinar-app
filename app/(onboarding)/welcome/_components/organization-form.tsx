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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import z from "zod";

import { slugify } from "@/lib/utils/services";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { organizationFormSchema } from "@/lib/validations/organization";

type OrganizationFormValues = z.infer<typeof organizationFormSchema>;

export default function OrganizationForm() {
  const router = useRouter();

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      type: "headquarters",
      path: "1",
    },
  });

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue("name", value, {
      shouldValidate: true,
    });
    form.setValue("slug", slugify(value), {
      shouldValidate: false,
    });
  };

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  const onSubmit = async (data: OrganizationFormValues) => {
    await authClient.organization.create(
      {
        name: data.name,
        slug: data.slug,
        type: data.type,
        path: data.path,
      },
      {
        onSuccess: async (ctx) => {
          const organizationId = ctx.data?.id;

          if (!organizationId) {
            toast.error("Erro ao criar organização");
            return;
          }

          await authClient.organization.setActive({
            organizationId,
          });
          toast.success("Organização criada com sucesso!");
          router.push("/organization");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      },
    );
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
                      onChange={onChangeName}
                      placeholder="Digite o nome da sua organização"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="slug"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor={field.name}>Subdomínio</FieldLabel>
                    </div>
                    <InputGroup>
                      <InputGroupInput
                        id={field.name}
                        {...field}
                        placeholder=""
                        disabled
                      />
                      <InputGroupAddon align="inline-end">
                        <span className="text-muted-foreground">
                          .germinar.app
                        </span>
                      </InputGroupAddon>
                    </InputGroup>
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
