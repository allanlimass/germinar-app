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
  ChartOfAccountFormSchema,
  CreateChartOfAccountInput,
  createChartOfAccountSchema,
} from "@/lib/validations/chart-of-account";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, SaveIcon, Loader2Icon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  createChartOfAccount,
  updateChartOfAccount,
} from "@/actions/chart-of-account-actions";
import React from "react";
import { DashboardHeader } from "@/components/layout/header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UpsertChartOfAccountFormProps {
  initialData?: ChartOfAccountFormSchema;
  chartOfAccounts?: ChartOfAccountFormSchema[];
}

export function UpsertChartOfAccountForm({
  initialData,
  chartOfAccounts,
}: UpsertChartOfAccountFormProps) {
  const router = useRouter();

  const submitTypeRef = React.useRef<"default" | "continue">("default");
  const isEditing = !!initialData;

  const form = useForm<CreateChartOfAccountInput>({
    resolver: zodResolver(createChartOfAccountSchema),
    defaultValues: {
      name: initialData?.name || "",
      type: initialData?.type || "INCOME",
      parentId: initialData?.parentId || null,
    },
  });

  const createChartOfAccountAction = useAction(createChartOfAccount, {
    onSuccess: () => {
      toast.success("Conta criada com sucesso!");
      if (submitTypeRef.current === "continue") {
        form.reset();
        return;
      }
      router.push("/finance/chart-of-accounts");
    },
    onError: ({ error }) => {
      toast.error("Erro ao criar conta: " + error.serverError);
    },
  });

  const updateChartOfAccountAction = useAction(updateChartOfAccount, {
    onSuccess: () => {
      toast.success("Conta atualizada com sucesso!");
      if (submitTypeRef.current === "continue") {
        return;
      }
      router.push("/finance/chart-of-accounts");
    },
    onError: ({ error }) => {
      toast.error("Erro ao atualizar conta: " + error.serverError);
    },
  });

  const onSubmit = (data: CreateChartOfAccountInput) => {
    if (isEditing && initialData) {
      updateChartOfAccountAction.execute({ ...data, id: initialData.id });
    } else {
      createChartOfAccountAction.execute(data);
    }
  };
  return (
    <>
      <DashboardHeader
        heading={isEditing ? "Editar Plano de Conta" : "Novo Plano de Conta"}
        text={
          isEditing
            ? "Edite os campos abaixo para atualizar o plano de conta"
            : "Preencha os campos abaixo para criar um novo plano de conta"
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
                  name="type"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="col-span-2">
                      <FieldLabel htmlFor={field.name}>Tipo</FieldLabel>
                      <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INCOME">Receita</SelectItem>
                          <SelectItem value="EXPENSE">Despesa</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="parentId"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    const selectedType = form.watch("type");

                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    const treeItems = React.useMemo(() => {
                      if (!chartOfAccounts) return [];

                      const filtered = chartOfAccounts.filter(
                        (account) => account.type === selectedType,
                      );

                      const childrenMap = new Map<
                        string | null,
                        ChartOfAccountFormSchema[]
                      >();
                      for (const account of filtered) {
                        const key = account.parentId ?? null;
                        if (!childrenMap.has(key)) {
                          childrenMap.set(key, []);
                        }
                        childrenMap.get(key)!.push(account);
                      }

                      const result: {
                        id: string;
                        name: string;
                        depth: number;
                      }[] = [];

                      const buildTree = (
                        parentId: string | null,
                        depth: number,
                      ) => {
                        const children = childrenMap.get(parentId) ?? [];
                        for (const child of children) {
                          result.push({
                            id: child.id,
                            name: child.name,
                            depth,
                          });
                          buildTree(child.id, depth + 1);
                        }
                      };

                      buildTree(null, 0);
                      return result;
                    }, [chartOfAccounts, selectedType]);

                    return (
                      <Field className="col-span-2">
                        <FieldLabel htmlFor={field.name}>Conta Pai</FieldLabel>
                        <Select
                          value={field.value ?? ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a conta pai..." />
                          </SelectTrigger>
                          <SelectContent>
                            {treeItems.map((item) => (
                              <SelectItem
                                key={item.id}
                                value={item.id}
                                className="cursor-pointer"
                                style={{
                                  paddingLeft: `${item.depth * 16 + 8}px`,
                                }}
                              >
                                {item.depth > 0 && (
                                  <span className="text-muted-foreground mr-1">
                                    {"↳"}
                                  </span>
                                )}
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    );
                  }}
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
    </>
  );
}
