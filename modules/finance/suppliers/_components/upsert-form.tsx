"use client";

import { Button } from "@/components/ui/button";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Supplier,
  CreateSupplierSchema,
  createSupplierSchema,
} from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveIcon, Loader2Icon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createSupplier, updateSupplier } from "../actions";
import React from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";

interface UpsertSupplierFormProps {
  initialData?: Supplier;
  branchId: string;
}

export function UpsertSupplierForm({
  initialData,
  branchId,
}: UpsertSupplierFormProps) {
  const router = useRouter();

  const submitTypeRef = React.useRef<"default" | "continue">("default");
  const isEditing = !!initialData;

  const form = useForm<CreateSupplierSchema>({
    resolver: zodResolver(createSupplierSchema),
    defaultValues: {
      isCompany: initialData?.isCompany || false,
      name: initialData?.name || "",
      companyName: initialData?.companyName || "",
      fantasyName: initialData?.fantasyName || "",
      cpf: initialData?.cpf || "",
      cnpj: initialData?.cnpj || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      zipCode: initialData?.zipCode || "",
      street: initialData?.street || "",
      number: initialData?.number || "",
      complement: initialData?.complement || "",
      neighborhood: initialData?.neighborhood || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
    },
  });

  const createSupplierAction = useAction(createSupplier, {
    onSuccess: () => {
      toast.success("Fornecedor criado com sucesso!");
      if (submitTypeRef.current === "continue") {
        form.reset();
        return;
      }
      router.push(`/branch/${branchId}/finance/suppliers`);
    },
    onError: ({ error }) => {
      toast.error("Erro ao criar fornecedor: " + error.serverError);
    },
  });

  const updateSupplierAction = useAction(updateSupplier, {
    onSuccess: () => {
      toast.success("Fornecedor atualizado com sucesso!");
      if (submitTypeRef.current === "continue") {
        return;
      }
      router.push(`/branch/${branchId}/finance/suppliers`);
    },
    onError: ({ error }) => {
      toast.error("Erro ao atualizar fornecedor: " + error.serverError);
    },
  });

  const onSubmit = (data: CreateSupplierSchema) => {
    if (isEditing && initialData) {
      updateSupplierAction.execute({ ...data, id: initialData.id });
    } else {
      createSupplierAction.execute(data);
    }
  };
  return (
    <>
      <DashboardHeader
        heading={isEditing ? "Editar Fornecedor" : "Novo Fornecedor"}
        text={
          isEditing
            ? "Edite os campos abaixo para atualizar o fornecedor"
            : "Preencha os campos abaixo para criar um novo fornecedor"
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
                  name="isCompany"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}></FieldLabel>
                      <RadioGroup
                        id={field.name}
                        value={String(field.value)}
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
                      >
                        <RadioGroupItem value="false" id="pf">
                          Pessoa Física
                        </RadioGroupItem>
                        <RadioGroupItem value="true" id="pessoaJuridica">
                          Pessoa Jurídica
                        </RadioGroupItem>
                      </RadioGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

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
                  name="companyName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="col-span-2">
                      <FieldLabel htmlFor={field.name}>Razão Social</FieldLabel>
                      <Input
                        id={field.name}
                        {...field}
                        value={field.value || ""}
                        placeholder="Digite a razão social"
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
