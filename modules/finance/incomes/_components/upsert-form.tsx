"use client";

import { Button } from "@/components/ui/button";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Income, CreateIncomeSchema, createIncomeSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { createIncome, updateIncome } from "../actions";
import React from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, CalendarIcon, UploadIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns/format";
import { NumericFormat } from "react-number-format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChurchMember as Contributor } from "@/modules/people/church-members/schemas";
import { ChartOfAccounts } from "@/modules/finance/chart-of-accounts/schemas";
import { CostCenter } from "@/modules/finance/cost-centers/schemas";
import { Account } from "@/modules/finance/accounts/schemas";
import { Checkbox } from "@/components/ui/checkbox";

interface UpsertIncomeFormProps {
  initialData?: Income;
  branchId: string;
  contributors?: Contributor[];
  chartOfAccounts?: ChartOfAccounts[];
  costCenters?: CostCenter[];
  accounts?: Account[];
}

export function UpsertIncomeForm({
  initialData,
  branchId,
  contributors,
  chartOfAccounts,
  costCenters,
  accounts,
}: UpsertIncomeFormProps) {
  const router = useRouter();

  const submitTypeRef = React.useRef<"default" | "continue">("default");
  const isEditing = !!initialData;

  const form = useForm<CreateIncomeSchema>({
    resolver: zodResolver(createIncomeSchema),
    defaultValues: {
      financeAccountId: initialData?.financeAccountId || "",
      financeChartOfAccountId: initialData?.financeChartOfAccountId || "",
      financeCostCenterId: initialData?.financeCostCenterId || "",
      financeSupplierId: initialData?.financeSupplierId || "",
      financeContributorId: initialData?.financeContributorId || "",
      type: "income",
      amount: Number(initialData?.amount) || 0,
      description: initialData?.description || "",
      dueDate: initialData?.dueDate || new Date(),
      paymentDate: initialData?.paymentDate || new Date(),
      paymentMethod: initialData?.paymentMethod || "pix",
      status: initialData?.status || "pending",
    },
  });

  const isPaid = useWatch({
    control: form.control,
    name: "status",
  });

  const createChurchFunctionAction = useAction(createIncome, {
    onSuccess: () => {
      toast.success("Receita criada com sucesso!");
      if (submitTypeRef.current === "continue") {
        form.reset();
        return;
      }
      router.push(`/branch/${branchId}/finance/incomes`);
    },
    onError: ({ error }) => {
      toast.error("Erro ao criar receita: " + error.serverError);
    },
  });

  const updateChurchFunctionAction = useAction(updateIncome, {
    onSuccess: () => {
      toast.success("Receita atualizada com sucesso!");
      if (submitTypeRef.current === "continue") {
        return;
      }
      router.push(`/branch/${branchId}/finance/incomes`);
    },
    onError: ({ error }) => {
      toast.error("Erro ao atualizar receita: " + error.serverError);
    },
  });

  const onSubmit = (data: CreateIncomeSchema) => {
    if (isEditing && initialData) {
      updateChurchFunctionAction.execute({ ...data, id: initialData.id });
    } else {
      createChurchFunctionAction.execute(data);
    }
  };
  return (
    <>
      <DashboardHeader
        heading={isEditing ? "Editar Receita" : "Nova Receita"}
        text={
          isEditing
            ? "Edite os campos abaixo para atualizar a receita"
            : "Preencha os campos abaixo para criar uma nova receita"
        }
        icon={<ArrowDown />}
        saveAction={form.handleSubmit(onSubmit)}
        cancelAction={() => router.push(`/branch/${branchId}/finance/incomes`)}
      />
      <form
        className="flex h-full flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.error("Form validation errors:", errors);
          toast.error("Por favor, verifique os campos do formulário.");
        })}
      >
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FieldGroup>
              <div className="grid gap-4 md:grid-cols-4">
                <Controller
                  name="dueDate"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Data de Vencimento
                      </FieldLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[280px] justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
                    <Field className="md:col-span-2">
                      <FieldLabel htmlFor={field.name}>
                        Descrição <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        {...field}
                        value={field.value || ""}
                        placeholder="Digite uma descrição"
                        required
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="amount"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Valor</FieldLabel>
                      <NumericFormat
                        id={field.name}
                        getInputRef={field.ref}
                        name={field.name}
                        onBlur={field.onBlur}
                        value={field.value ?? ""}
                        placeholder="0,00"
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="R$ "
                        decimalScale={2}
                        fixedDecimalScale
                        allowNegative={false}
                        onValueChange={(value) =>
                          field.onChange(value.floatValue ?? 0)
                        }
                        customInput={Input}
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
                  name="financeContributorId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="md:col-span-2">
                      <FieldLabel htmlFor={field.name}>Recebido de</FieldLabel>
                      <Combobox
                        items={contributors}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <ComboboxInput placeholder="Selecione" />
                        <ComboboxContent>
                          <ComboboxEmpty>Nenhum item encontrado</ComboboxEmpty>
                          <ComboboxList>
                            {(item) => (
                              <ComboboxItem key={item.id} value={item.name}>
                                {item.name}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="financeChartOfAccountId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Plano de Conta
                      </FieldLabel>
                      <Combobox
                        items={chartOfAccounts}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <ComboboxInput placeholder="Selecione" />
                        <ComboboxContent>
                          <ComboboxEmpty>Nenhum item encontrado</ComboboxEmpty>
                          <ComboboxList>
                            {(item) => (
                              <ComboboxItem key={item.id} value={item.name}>
                                {item.name}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="financeCostCenterId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Centro de Custo
                      </FieldLabel>
                      <Combobox
                        items={costCenters}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <ComboboxInput placeholder="Selecione" />
                        <ComboboxContent>
                          <ComboboxEmpty>Nenhum item encontrado</ComboboxEmpty>
                          <ComboboxList>
                            {(item) => (
                              <ComboboxItem key={item.id} value={item}>
                                {item.name}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
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
            <CardTitle>Informações do Recebimento</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <div className="grid gap-4">
                <Controller
                  name="status"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="gap-2" orientation="horizontal">
                      <Checkbox
                        id={field.name}
                        name={field.name}
                        checked={field.value === "paid"}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? "paid" : "pending")
                        }
                      />
                      <FieldLabel htmlFor={field.name}>Recebido?</FieldLabel>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Controller
                  name="paymentDate"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Data de Recebimento
                      </FieldLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            disabled={isPaid !== "paid"}
                            className={cn(
                              "w-[280px] justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="paymentMethod"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Método de Pagamento
                      </FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isPaid !== "paid"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Dinheiro</SelectItem>
                          <SelectItem value="credit_card">
                            Cartão de Crédito
                          </SelectItem>
                          <SelectItem value="debit_card">
                            Cartão de Débito
                          </SelectItem>
                          <SelectItem value="check">Cheque</SelectItem>
                          <SelectItem value="bank_slip">Boleto</SelectItem>
                          <SelectItem value="pix">Pix</SelectItem>
                          <SelectItem value="transfer">
                            Transferência
                          </SelectItem>
                          <SelectItem value="other">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="financeAccountId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Conta</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isPaid !== "paid"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts?.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.name}
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
              <div className="grid gap-4">
                {/* Upload Area */}
                <div
                  className={cn(
                    "border-muted-foreground/25 hover:border-muted-foreground/50 relative rounded-lg border-dashed p-8 text-center transition-colors",
                  )}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div
                      className={cn(
                        "bg-muted flex h-16 w-16 items-center justify-center rounded-full",
                      )}
                    >
                      <UploadIcon
                        className={cn(
                          "h-6",
                          isPaid !== "paid"
                            ? "text-muted-foreground"
                            : "text-primary",
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações Adicionais</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <div className="grid gap-4">
                <Controller
                  name="financeChartOfAccountId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Conta Contábil
                      </FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isPaid !== "paid"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts?.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.name}
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
                  name="financeCostCenterId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Centro de Custo
                      </FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isPaid !== "paid"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts?.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.name}
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

        <Card>
          <CardHeader>
            <CardTitle>Informações Adicionais</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <div className="grid gap-4">
                <Controller
                  name="financeChartOfAccountId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Conta Contábil
                      </FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isPaid !== "paid"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts?.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.name}
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
                  name="financeCostCenterId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Centro de Custo
                      </FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isPaid !== "paid"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts?.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.name}
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

        <Card>
          <CardHeader>
            <CardTitle>Informações Adicionais</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <div className="grid gap-4">
                <Controller
                  name="financeChartOfAccountId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Conta Contábil
                      </FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isPaid !== "paid"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts?.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.name}
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
                  name="financeCostCenterId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Centro de Custo
                      </FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isPaid !== "paid"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts?.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.name}
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
      </form>
    </>
  );
}
