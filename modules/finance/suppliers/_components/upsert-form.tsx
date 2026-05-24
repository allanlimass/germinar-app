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
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { createSupplier, updateSupplier } from "../actions";
import React from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { federativeUnits } from "@/data/federative-units";
import { PatternFormat } from "react-number-format";

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

  const isCompany = useWatch({
    control: form.control,
    name: "isCompany",
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
        className="space-y-6"
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.error("Form validation errors:", errors);
          toast.error("Por favor, verifique os campos do formulário.");
        })}
      >
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>
              Preencha as informações de identificação do fornecedor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FieldGroup>
              <Controller
                name="isCompany"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Tipo</FieldLabel>
                    <RadioGroup
                      id={field.name}
                      className="flex items-center space-x-4"
                      value={String(field.value)}
                      onValueChange={(value) =>
                        field.onChange(value === "true")
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="pf" />
                        <Label htmlFor="pf">PF</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="pj" />
                        <Label htmlFor="pj">PJ</Label>
                      </div>
                    </RadioGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        {isCompany ? "Razão Social" : "Nome"}
                      </FieldLabel>
                      <Input
                        id={field.name}
                        {...field}
                        placeholder={`Digite ${isCompany ? "a razão social" : "o nome"}`}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {isCompany && (
                  <Controller
                    name="fantasyName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>
                          Nome Fantasia
                        </FieldLabel>
                        <Input
                          id={field.name}
                          {...field}
                          value={field.value || ""}
                          placeholder="Digite o nome fantasia"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Controller
                  name={isCompany ? "cnpj" : "cpf"}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        {isCompany ? "CNPJ" : "CPF"}
                      </FieldLabel>
                      <PatternFormat
                        format={
                          isCompany ? "##.###.###/####-##" : "###.###.###-##"
                        }
                        mask={
                          isCompany
                            ? [
                                "#",
                                "#",
                                ".",
                                "#",
                                "#",
                                "#",
                                ".",
                                "#",
                                "#",
                                "#",
                                "/",
                                "#",
                                "#",
                                "#",
                                "#",
                                "-",
                                "#",
                                "#",
                              ]
                            : [
                                "#",
                                "#",
                                "#",
                                ".",
                                "#",
                                "#",
                                "#",
                                ".",
                                "#",
                                "#",
                                "#",
                                "-",
                                "#",
                                "#",
                              ]
                        }
                        customInput={Input}
                        value={field.value ?? ""}
                        onValueChange={(values) => {
                          field.onChange(values.value);
                        }}
                        placeholder={
                          isCompany ? "00.000.000/0000-00" : "000.000.000-00"
                        }
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Controller
                  name="phone"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Telefone</FieldLabel>
                      <Input
                        id={field.name}
                        {...field}
                        value={field.value || ""}
                        placeholder="(00) 00000-0000"
                      />
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
                      <FieldLabel htmlFor={field.name}>E-mail</FieldLabel>
                      <Input
                        id={field.name}
                        {...field}
                        value={field.value || ""}
                        placeholder="email@exemplo.com"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
            <CardDescription>
              Informações de endereço do fornecedor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FieldGroup>
              <div className="grid gap-4 md:grid-cols-3">
                <Controller
                  name="zipCode"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>CEP</FieldLabel>
                      <Input
                        id={field.name}
                        {...field}
                        value={field.value || ""}
                        placeholder="00000-000"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="street"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="md:col-span-2">
                      <FieldLabel htmlFor={field.name}>
                        Rua / Logradouro
                      </FieldLabel>
                      <Input
                        id={field.name}
                        {...field}
                        value={field.value || ""}
                        placeholder="Digite a rua / logradouro"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <Controller
                  name="number"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Número</FieldLabel>
                      <Input
                        id={field.name}
                        {...field}
                        value={field.value || ""}
                        placeholder="Digite o número"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="complement"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Complemento</FieldLabel>
                      <Input
                        id={field.name}
                        {...field}
                        value={field.value || ""}
                        placeholder="Digite o complemento"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="neighborhood"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="md:col-span-2">
                      <FieldLabel htmlFor={field.name}>Bairro</FieldLabel>
                      <Input
                        id={field.name}
                        {...field}
                        value={field.value || ""}
                        placeholder="Digite o bairro"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Controller
                  name="city"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Cidade</FieldLabel>
                      <Input
                        id={field.name}
                        {...field}
                        value={field.value || ""}
                        placeholder="Digite a cidade"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="state"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Estado</FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {federativeUnits.map((state) => (
                            <SelectItem key={state.value} value={state.value}>
                              {state.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>
          </CardContent>
        </Card>

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
      </form>
    </>
  );
}
