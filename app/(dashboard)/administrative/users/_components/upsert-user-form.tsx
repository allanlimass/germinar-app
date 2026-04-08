"use client";

import { Button } from "@/components/ui/button";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InsertInvitation,
  insertInvitationSchema,
} from "@/lib/validations/invitation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import React from "react";
import {
  Select,
  SelectTrigger,
  SelectGroup,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";

interface UpsertUserFormProps {
  organizationId: string;
}

export function UpsertUserForm({ organizationId }: UpsertUserFormProps) {
  const router = useRouter();

  const submitTypeRef = React.useRef<"default" | "continue">("default");

  const form = useForm<InsertInvitation>({
    resolver: zodResolver(insertInvitationSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });

  const onSubmit = async (values: InsertInvitation) => {
    await authClient.organization.inviteMember(
      {
        email: values.email,
        role: values.role,
        organizationId,
      },
      {
        onError: (ctx) => {
          if (ctx.error.code === "ALREADY_MEMBER") {
            toast.error("Usuário já é membro da organização.");
            return;
          }
          toast.error("Erro ao convidar usuário.");
        },
        onSuccess: () => {
          toast.success("Convite enviado com sucesso!");
          router.push("/administrative/users");
        },
      },
    );
  };

  return (
    <form
      className="flex h-full flex-col"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup className="flex-1">
        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="col-span-2">
                    <FieldLabel htmlFor={field.name}>E-mail</FieldLabel>
                    <Input
                      id={field.name}
                      {...field}
                      placeholder="Digite o e-mail"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="role"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="col-span-2">
                    <FieldLabel htmlFor={field.name}>Perfil</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o perfil" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="owner">Proprietário</SelectItem>
                          <SelectItem value="member">Membro</SelectItem>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="secretary">Secretário</SelectItem>
                          <SelectItem value="treasurer">Tesoureiro</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </div>

          <div className="flex w-full items-center justify-between pt-4">
            <Field className="flex flex-1">
              <div className="flex items-center justify-start">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.back()}
                >
                  Cancelar
                </Button>
              </div>
            </Field>

            <Field
              orientation="horizontal"
              className="flex flex-1 items-center justify-end gap-4"
            >
              <Button
                type="submit"
                variant="outline"
                disabled={form.formState.isSubmitting}
                onClick={() => (submitTypeRef.current = "continue")}
              >
                <SaveIcon className="h-4 w-4" />
                {form.formState.isSubmitting ? (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                ) : (
                  "Convidar & Continuar"
                )}
              </Button>

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                onClick={() => (submitTypeRef.current = "default")}
              >
                <SaveIcon className="h-4 w-4" />
                {form.formState.isSubmitting ? (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                ) : (
                  "Convidar"
                )}
              </Button>
            </Field>
          </div>
        </div>
      </FieldGroup>
    </form>
  );
}
