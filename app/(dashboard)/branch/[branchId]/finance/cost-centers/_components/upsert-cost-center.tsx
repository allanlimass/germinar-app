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
  CostCenterFormSchema,
  CreateCostCenterSchema,
  createCostCenterSchema,
} from "@/lib/validations/cost-center";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveIcon, Loader2Icon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  createCostCenter,
  updateCostCenter,
} from "@/actions/cost-center-actions";
import React from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";

interface UpsertCostCenterFormProps {
  initialData?: CostCenterFormSchema;
}

export function UpsertCostCenterForm({
  initialData,
}: UpsertCostCenterFormProps) {
  const router = useRouter();

  const submitTypeRef = React.useRef<"default" | "continue">("default");
  const isEditing = !!initialData;

  const form = useForm<CreateCostCenterSchema>({
    resolver: zodResolver(createCostCenterSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
    },
  });

  const createChurchFunctionAction = useAction(createCostCenter, {
    onSuccess: () => {
      toast.success("Centro de custo criado com sucesso!");
      if (submitTypeRef.current === "continue") {
        form.reset();
        return;
      }
      router.push("/finance/cost-centers");
    },
    onError: ({ error }) => {
      toast.error("Erro ao criar centro de custo: " + error.serverError);
    },
  });

  const updateChurchFunctionAction = useAction(updateCostCenter, {
    onSuccess: () => {
      toast.success("Centro de custo atualizado com sucesso!");
      if (submitTypeRef.current === "continue") {
        return;
      }
      router.push("/finance/cost-centers");
    },
    onError: ({ error }) => {
      toast.error("Erro ao atualizar centro de custo: " + error.serverError);
    },
  });

  const onSubmit = (data: CreateCostCenterSchema) => {
    if (isEditing && initialData) {
      updateChurchFunctionAction.execute({ ...data, id: initialData.id });
    } else {
      createChurchFunctionAction.execute(data);
    }
  };
  return (
    <>
      <DashboardHeader
        heading={isEditing ? "Editar Centro de Custo" : "Novo Centro de Custo"}
        text={
          isEditing
            ? "Edite os campos abaixo para atualizar o centro de custo"
            : "Preencha os campos abaixo para criar um novo centro de custo"
        }
      />
      <form
        className="flex h-full flex-col"
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.error("Form validation errors:", errors);
          toast.error("Por favor, verifique os campos do formulário.");
        })}
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
                        value={field.value || ""}
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
                  ) : isEditing ? (
                    "Salvar & Continuar"
                  ) : (
                    "Adicionar & Continuar"
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
    </>
  );
}
