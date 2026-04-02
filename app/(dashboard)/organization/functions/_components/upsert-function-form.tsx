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
  ChurchFunctionSchema,
  InsertChurchFunction,
  insertChurchFunctionSchema,
} from "@/lib/validations/functions";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, SaveIcon, Loader2Icon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  createChurchFunction,
  updateChurchFunction,
} from "@/actions/functions";
import React from "react";

interface UpsertChurchFunctionFormProps {
  initialData?: ChurchFunctionSchema;
}

export function UpsertChurchFunctionForm({
  initialData,
}: UpsertChurchFunctionFormProps) {
  const router = useRouter();

  const submitTypeRef = React.useRef<"default" | "continue">("default");
  const isEditing = !!initialData;

  const form = useForm<InsertChurchFunction>({
    resolver: zodResolver(insertChurchFunctionSchema),
    defaultValues: {
      ...initialData,
      name: initialData?.name || "",
      description: initialData?.description || "",
    },
  });

  const createChurchFunctionAction = useAction(createChurchFunction, {
    onSuccess: () => {
      toast.success("Função criada com sucesso!");
      if (submitTypeRef.current === "continue") {
        form.reset();
        router.refresh();
        return;
      }
      router.push("/organization/functions");
    },
    onError: ({ error }) => {
      toast.error("Erro ao criar função: " + error.serverError);
    },
  });

  const updateChurchFunctionAction = useAction(updateChurchFunction, {
    onSuccess: () => {
      toast.success("Função atualizada com sucesso!");
      if (submitTypeRef.current === "continue") {
        router.refresh();
        return;
      }
      router.push("/organization/functions");
    },
    onError: ({ error }) => {
      toast.error("Erro ao atualizar função: " + error.serverError);
    },
  });

  const onSubmit = (data: InsertChurchFunction) => {
    if (isEditing && initialData) {
      updateChurchFunctionAction.execute({ ...data, id: initialData.id });
    } else {
      createChurchFunctionAction.execute(data);
    }
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
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="col-span-2">
                    <FieldLabel htmlFor={field.name}>Nome</FieldLabel>
                    <Input
                      id={field.name}
                      {...field}
                      placeholder="Digite o nome"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="col-span-2">
                    <FieldLabel htmlFor={field.name}>Descrição</FieldLabel>
                    <Input
                      id={field.name}
                      {...field}
                      placeholder="Digite a descrição"
                    />
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
                  <ArrowLeftIcon className="h-4 w-4" />
                  Voltar
                </Button>
              </div>
            </Field>

            <Field
              orientation="horizontal"
              className="flex flex-1 items-center justify-end gap-4"
            >
              <Button
                type="button"
                variant="outline"
                disabled={form.formState.isSubmitting}
              >
                <SaveIcon className="h-4 w-4" />
                {form.formState.isSubmitting ? (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                ) : isEditing ? (
                  "Salvar & Continuar"
                ) : (
                  "Adicionar & Continuar"
                )}
              </Button>

              <Button type="submit" disabled={form.formState.isSubmitting}>
                <SaveIcon className="h-4 w-4" />
                {form.formState.isSubmitting ? (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                ) : isEditing ? (
                  "Salvar"
                ) : (
                  "Adicionar"
                )}
              </Button>
            </Field>
          </div>
        </div>
      </FieldGroup>
    </form>
  );
}
