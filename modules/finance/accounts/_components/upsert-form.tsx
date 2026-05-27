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
  Account,
  CreateAccountSchema,
  createAccountSchema,
  Bank,
} from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { createAccount, updateAccount } from "../actions";
import React from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
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
import { NumericFormat } from "react-number-format";

interface UpsertAccountFormProps {
  initialData?: Account;
  branchId: string;
  banks: Bank[];
}

export function UpsertAccountForm({
  initialData,
  branchId,
  banks,
}: UpsertAccountFormProps) {
  const router = useRouter();

  const submitTypeRef = React.useRef<"default" | "continue">("default");
  const isEditing = !!initialData;

  const form = useForm<CreateAccountSchema>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      bankId: initialData?.bankId || null,
      name: initialData?.name || "",
      agency: initialData?.agency || "",
      account: initialData?.account || "",
      type: initialData?.type || "checking",
    },
  });

  const watchType = useWatch({ control: form.control, name: "type" });

  const createAccountAction = useAction(createAccount, {
    onSuccess: () => {
      toast.success("Conta criada com sucesso!");
      if (submitTypeRef.current === "continue") {
        form.reset();
        return;
      }
      router.push(`/branch/${branchId}/finance/accounts`);
    },
    onError: ({ error }) => {
      toast.error("Erro ao criar conta: " + error.serverError);
    },
  });

  const updateAccountAction = useAction(updateAccount, {
    onSuccess: () => {
      toast.success("Conta atualizada com sucesso!");
      if (submitTypeRef.current === "continue") {
        return;
      }
      router.push(`/branch/${branchId}/finance/accounts`);
    },
    onError: ({ error }) => {
      toast.error("Erro ao atualizar conta: " + error.serverError);
    },
  });

  const onSubmit = (data: CreateAccountSchema) => {
    if (isEditing && initialData) {
      updateAccountAction.execute({ ...data, id: initialData.id });
    } else {
      createAccountAction.execute(data);
    }
  };
  return (
    <>
      <DashboardHeader
        heading={isEditing ? "Editar Conta" : "Nova Conta"}
        text={
          isEditing
            ? "Edite os campos abaixo para atualizar a conta"
            : "Preencha os campos abaixo para criar uma nova conta"
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
              Preencha as informações de identificação da conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FieldGroup>
              <div className="grid gap-4 md:grid-cols-3">
                <Controller
                  name="type"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Tipo</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo da conta" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="checking">
                            Conta Corrente
                          </SelectItem>
                          <SelectItem value="savings">
                            Conta Poupança
                          </SelectItem>
                          <SelectItem value="cash">Caixa</SelectItem>
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
                        type="text"
                        placeholder="Ex: Conta Banco Bradesco"
                        {...field}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              {watchType !== "cash" && (
                <div className="grid gap-4 md:grid-cols-4">
                  <Controller
                    name="bankId"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field className="col-span-2">
                        <FieldLabel htmlFor={field.name}>Banco</FieldLabel>
                        <Select
                          value={field.value ? String(field.value) : undefined}
                          onValueChange={(value) => {
                            if (!value || value === "") {
                              field.onChange(null);
                            } else {
                              field.onChange(Number(value));
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o banco" />
                          </SelectTrigger>
                          <SelectContent>
                            {banks.map((bank) => (
                              <SelectItem key={bank.id} value={String(bank.id)}>
                                {bank.id} - {bank.name}
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

                  <Controller
                    name="agency"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Agência</FieldLabel>
                        <NumericFormat
                          {...field}
                          allowNegative={false}
                          decimalScale={0}
                          customInput={Input}
                          placeholder="Ex: 1234"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="account"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Conta</FieldLabel>
                        <NumericFormat
                          {...field}
                          allowNegative={false}
                          decimalScale={0}
                          customInput={Input}
                          placeholder="Ex: 1234567890"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              )}
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
