"use client";

import { createBranch, updateBranch } from "@/actions/branch";
import { Button } from "@/components/ui/button";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { federativeUnits } from "@/data/federative-units";
import {
  formatCnpj,
  formatPhoneNumber,
  formatZipCode,
} from "@/lib/utils/services";
import { branchFormSchema } from "@/lib/validations/branch";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, SaveIcon, Loader2Icon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Branch } from "./columns";
import React from "react";

interface UpsertBranchFormProps {
  initialData?: Branch;
}

export function UpsertBranchForm({ initialData }: UpsertBranchFormProps) {
  const router = useRouter();

  const submitTypeRef = React.useRef<"default" | "continue">("default");
  const isEditing = !!initialData;

  const form = useForm<z.infer<typeof branchFormSchema>>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: {
      ...initialData,
      isHeadquarter: initialData?.isHeadquarter || false,
      name: initialData?.name || "",
      cnpj: initialData?.cnpj || "",
      phone: initialData?.phone || "",
      email: initialData?.email || "",
      zipCode: initialData?.zipCode || "",
      street: initialData?.street || "",
      number: initialData?.number || "",
      complement: initialData?.complement || "",
      neighborhood: initialData?.neighborhood || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
    },
  });

  const createBranchAction = useAction(createBranch, {
    onSuccess: () => {
      toast.success("Filial criada com sucesso!");
      if (submitTypeRef.current === "continue") {
        form.reset();
        router.refresh();
        return;
      }
      router.push("/organization/branches");
    },
    onError: ({ error }) => {
      toast.error("Erro ao criar filial: " + error.serverError);
    },
  });

  const updateBranchAction = useAction(updateBranch, {
    onSuccess: () => {
      toast.success("Filial atualizada com sucesso!");
      if (submitTypeRef.current === "continue") {
        router.refresh();
        return;
      }
      router.push("/organization/branches");
    },
    onError: ({ error }) => {
      toast.error("Erro ao atualizar filial: " + error.serverError);
    },
  });

  const onSubmit = (data: z.infer<typeof branchFormSchema>) => {
    if (isEditing && initialData) {
      updateBranchAction.execute({ ...data, id: initialData.id });
    } else {
      createBranchAction.execute(data);
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
                name="isHeadquarter"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="col-span-1">
                    <FieldLabel htmlFor={field.name}>Tipo</FieldLabel>
                    <Select
                      value={field.value.toString()}
                      onValueChange={(value) =>
                        field.onChange(value === "true")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="true">Matriz</SelectItem>
                          <SelectItem value="false">Filial</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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
                name="cnpj"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="col-span-1">
                    <FieldLabel htmlFor={field.name}>CNPJ</FieldLabel>
                    <Input
                      id={field.name}
                      {...field}
                      placeholder="Digite o CNPJ"
                      maxLength={18}
                      onChange={(e) =>
                        field.onChange(formatCnpj(e.target.value))
                      }
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      {...field}
                      placeholder="Digite o email"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Telefone</FieldLabel>
                    <Input
                      id={field.name}
                      {...field}
                      placeholder="Digite o telefone"
                      maxLength={15}
                      onChange={(e) =>
                        field.onChange(formatPhoneNumber(e.target.value))
                      }
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              <Controller
                name="zipCode"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="col-span-1">
                    <FieldLabel htmlFor={field.name}>CEP</FieldLabel>
                    <Input
                      id={field.name}
                      {...field}
                      placeholder="Digite o CEP"
                      maxLength={9}
                      onChange={(e) =>
                        field.onChange(formatZipCode(e.target.value))
                      }
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
                  <Field className="col-span-3">
                    <FieldLabel htmlFor={field.name}>Rua</FieldLabel>
                    <Input
                      id={field.name}
                      {...field}
                      placeholder="Digite a rua"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="number"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Número</FieldLabel>
                    <Input
                      id={field.name}
                      {...field}
                      placeholder="Digite o número"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
              <Controller
                name="complement"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="col-span-2">
                    <FieldLabel htmlFor={field.name}>Complemento</FieldLabel>
                    <Input
                      id={field.name}
                      {...field}
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
                  <Field>
                    <FieldLabel htmlFor={field.name}>Bairro</FieldLabel>
                    <Input
                      id={field.name}
                      {...field}
                      placeholder="Digite o bairro"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="city"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="col-span-2">
                    <FieldLabel htmlFor={field.name}>Cidade</FieldLabel>
                    <Input
                      id={field.name}
                      {...field}
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
                    <FieldLabel htmlFor={field.name}>UF</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a UF" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {federativeUnits.map((state) => (
                            <SelectItem key={state.value} value={state.value}>
                              {state.value}
                            </SelectItem>
                          ))}
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
  );
}
