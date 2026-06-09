"use client";

import { Button } from "@/components/ui/button";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
  FieldTitle,
  FieldDescription,
  FieldContent,
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
import { ArrowDown, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns/format";
import { NumericFormat } from "react-number-format";
import { ChurchMember as Contributor } from "@/modules/people/church-members/schemas";
import { ChartOfAccounts } from "@/modules/finance/chart-of-accounts/schemas";
import { CostCenter } from "@/modules/finance/cost-centers/schemas";
import { Account } from "@/modules/finance/accounts/schemas";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";

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

  const paymentMethods = [
    { value: "cash", label: "Dinheiro" },
    { value: "pix", label: "PIX" },
    { value: "credit_card", label: "Cartão de Crédito" },
    { value: "debit_card", label: "Cartão de Crédito" },
    { value: "check", label: "Cheque" },
    { value: "bank_slip", label: "Boleto" },
    { value: "transfer", label: "Transferência" },
    { value: "other", label: "Outro" },
  ];

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
      paymentMethod: initialData?.paymentMethod || null,
      fines: Number(initialData?.fines) || 0,
      fees: Number(initialData?.fees) || 0,
      paidAmount: Number(initialData?.paidAmount) || 0,
      periodicity: initialData?.periodicity || "unique",
      periodicityRecurrenceFrequency:
        initialData?.periodicityRecurrenceFrequency || "",
      periodicityParcelledQuantity:
        initialData?.periodicityParcelledQuantity || 0,
      periodicityParcelledPeriod: initialData?.periodicityParcelledPeriod || "",
      periodicityParcelledSplit:
        initialData?.periodicityParcelledSplit || false,
      status: initialData?.status || "pending",
    },
  });

  const isPaid = useWatch({
    control: form.control,
    name: "status",
  });
  const isPeriodic = useWatch({
    control: form.control,
    name: "periodicity",
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
        saveAndContinueAction={() => {
          submitTypeRef.current = "continue";
          onSubmit(form.getValues());
        }}
        cancelAction={() => router.push(`/branch/${branchId}/finance/incomes`)}
      />

      <form
        className="flex h-full flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.error("Form validation errors:", errors);
          toast.error("Por favor, verifique os campos do formulário.");
        })}
      >
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent>
            <FieldGroup className="gap-5">
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
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="text-muted-foreground h-4 w-4" />
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
                      <FieldLabel htmlFor={field.name}>
                        Valor<span className="text-destructive">*</span>
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupAddon>
                          <InputGroupText>R$</InputGroupText>
                        </InputGroupAddon>
                        <NumericFormat
                          id={field.name}
                          getInputRef={field.ref}
                          name={field.name}
                          onBlur={field.onBlur}
                          value={field.value ?? ""}
                          placeholder="0,00"
                          thousandSeparator="."
                          decimalSeparator=","
                          decimalScale={2}
                          fixedDecimalScale
                          allowNegative={false}
                          onValueChange={(value) =>
                            field.onChange(value.floatValue ?? 0)
                          }
                          customInput={InputGroupInput}
                          required
                        />
                      </InputGroup>
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
                    <Field className="col-span-2">
                      <FieldLabel htmlFor={field.name}>Contribuinte</FieldLabel>
                      <Combobox
                        items={contributors?.map((account) => ({
                          value: account.id,
                          label: account.name,
                        }))}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <ComboboxInput placeholder="Selecione" />
                        <ComboboxContent>
                          <ComboboxEmpty>Nenhum item encontrado</ComboboxEmpty>
                          <ComboboxList>
                            {(item) => (
                              <ComboboxItem key={item.value} value={item}>
                                {item.label}
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
                        items={chartOfAccounts?.map((account) => ({
                          value: account.id,
                          label: account.name,
                        }))}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <ComboboxInput placeholder="Selecione" />
                        <ComboboxContent>
                          <ComboboxEmpty>Nenhum item encontrado</ComboboxEmpty>
                          <ComboboxList>
                            {(item) => (
                              <ComboboxItem key={item.value} value={item}>
                                {item.label}
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
                        items={costCenters?.map((account) => ({
                          value: account.id,
                          label: account.name,
                        }))}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <ComboboxInput placeholder="Selecione" />
                        <ComboboxContent>
                          <ComboboxEmpty>Nenhum item encontrado</ComboboxEmpty>
                          <ComboboxList>
                            {(item) => (
                              <ComboboxItem key={item.value} value={item}>
                                {item.label}
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

        <Card className="rounded-md">
          <CardHeader>
            <CardTitle>Dados do Recebimento</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent>
            <FieldGroup className="gap-5">
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
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="text-muted-foreground h-4 w-4" />
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
                      <Combobox
                        items={paymentMethods}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <ComboboxInput
                          disabled={isPaid !== "paid"}
                          placeholder="Selecione"
                        />
                        <ComboboxContent>
                          <ComboboxEmpty>Nenhum item encontrado</ComboboxEmpty>
                          <ComboboxList>
                            {(item) => (
                              <ComboboxItem key={item.value} value={item}>
                                {item.label}
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
                  name="financeAccountId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Conta</FieldLabel>
                      <Combobox
                        items={accounts?.map((account) => ({
                          value: account.id,
                          label: account.name,
                        }))}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <ComboboxInput
                          disabled={isPaid !== "paid"}
                          placeholder="Selecione"
                        />
                        <ComboboxContent>
                          <ComboboxEmpty>Nenhum item encontrado</ComboboxEmpty>
                          <ComboboxList>
                            {(item) => (
                              <ComboboxItem key={item.value} value={item}>
                                {item.label}
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

              <div className="grid gap-4 md:grid-cols-3">
                <Controller
                  name="fines"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Juros/Multa</FieldLabel>
                      <InputGroup>
                        <InputGroupAddon>
                          <InputGroupText>R$</InputGroupText>
                        </InputGroupAddon>
                        <NumericFormat
                          id={field.name}
                          getInputRef={field.ref}
                          name={field.name}
                          onBlur={field.onBlur}
                          value={field.value ?? ""}
                          placeholder="0,00"
                          thousandSeparator="."
                          decimalSeparator=","
                          decimalScale={2}
                          fixedDecimalScale
                          allowNegative={false}
                          onValueChange={(value) =>
                            field.onChange(value.floatValue ?? 0)
                          }
                          customInput={InputGroupInput}
                          disabled={isPaid !== "paid"}
                          required
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="fees"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Taxas</FieldLabel>
                      <InputGroup>
                        <InputGroupAddon>
                          <InputGroupText>R$</InputGroupText>
                        </InputGroupAddon>
                        <NumericFormat
                          id={field.name}
                          getInputRef={field.ref}
                          name={field.name}
                          onBlur={field.onBlur}
                          value={field.value ?? ""}
                          placeholder="0,00"
                          thousandSeparator="."
                          decimalSeparator=","
                          decimalScale={2}
                          fixedDecimalScale
                          allowNegative={false}
                          onValueChange={(value) =>
                            field.onChange(value.floatValue ?? 0)
                          }
                          customInput={InputGroupInput}
                          disabled={isPaid !== "paid"}
                          required
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="paidAmount"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Valor Recebido
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupAddon>
                          <InputGroupText>R$</InputGroupText>
                        </InputGroupAddon>
                        <NumericFormat
                          id={field.name}
                          getInputRef={field.ref}
                          name={field.name}
                          onBlur={field.onBlur}
                          value={field.value ?? ""}
                          placeholder="0,00"
                          thousandSeparator="."
                          decimalSeparator=","
                          decimalScale={2}
                          fixedDecimalScale
                          allowNegative={false}
                          onValueChange={(value) =>
                            field.onChange(value.floatValue ?? 0)
                          }
                          customInput={InputGroupInput}
                          disabled={isPaid !== "paid"}
                          readOnly
                          required
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="financeAttachmentId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Anexo</FieldLabel>
                      <Input
                        type="file"
                        id={field.name}
                        {...field}
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                        disabled={isPaid !== "paid"}
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

        <Card className="rounded-md">
          <CardHeader>
            <CardTitle>Dados de Recorrência</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent>
            <FieldGroup>
              <div>
                <Controller
                  name="periodicity"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <RadioGroup
                        defaultValue="unique"
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex w-full"
                      >
                        <FieldLabel htmlFor={field.name}>
                          <Field orientation="horizontal">
                            <FieldContent>
                              <FieldTitle>Único</FieldTitle>
                              <FieldDescription>
                                Este lançamento ocorrerá apenas uma vez
                              </FieldDescription>
                            </FieldContent>
                            <RadioGroupItem value="unique" id="unique" />
                          </Field>
                        </FieldLabel>

                        <FieldLabel htmlFor={field.name}>
                          <Field orientation="horizontal">
                            <FieldContent>
                              <FieldTitle>Recorrente</FieldTitle>
                              <FieldDescription>
                                Este lançamento ocorrerá em intervalos regulares
                              </FieldDescription>
                            </FieldContent>
                            <RadioGroupItem value="recorrent" id="recorrent" />
                          </Field>
                        </FieldLabel>

                        <FieldLabel htmlFor={field.name}>
                          <Field orientation="horizontal">
                            <FieldContent>
                              <FieldTitle>Parcelado</FieldTitle>
                              <FieldDescription>
                                Este lançamento ocorrerá em parcelas
                              </FieldDescription>
                            </FieldContent>
                            <RadioGroupItem value="parcelled" id="parcelled" />
                          </Field>
                        </FieldLabel>
                      </RadioGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              {isPeriodic === "recorrent" && (
                <div>
                  <Controller
                    name="periodicityRecurrenceFrequency"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field className="gap-2">
                        <FieldLabel htmlFor={field.name}>Período</FieldLabel>
                        <RadioGroup
                          defaultValue="monthly"
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex w-full"
                        >
                          <Field orientation="horizontal" className="gap-2">
                            <RadioGroupItem value="daily" id="daily" />
                            <FieldLabel htmlFor="daily">Diário</FieldLabel>
                          </Field>
                          <Field orientation="horizontal" className="gap-2">
                            <RadioGroupItem value="weekly" id="weekly" />
                            <FieldLabel htmlFor="weekly">Semanal</FieldLabel>
                          </Field>
                          <Field orientation="horizontal" className="gap-2">
                            <RadioGroupItem value="monthly" id="monthly" />
                            <FieldLabel htmlFor="monthly">Mensal</FieldLabel>
                          </Field>
                          <Field orientation="horizontal" className="gap-2">
                            <RadioGroupItem value="yearly" id="yearly" />
                            <FieldLabel htmlFor="yearly">Anual</FieldLabel>
                          </Field>
                        </RadioGroup>

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              )}

              {isPeriodic === "parcelled" && (
                <div className="grid items-end gap-4 md:grid-cols-3">
                  <Controller
                    name="periodicityParcelledQuantity"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field className="gap-2">
                        <FieldLabel htmlFor={field.name}>Quantidade</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id={field.name}
                            type="number"
                            min={2}
                            className="w-full"
                            value={field.value}
                            onValueChange={field.onChange}
                          />
                          <InputGroupAddon align="inline-end">
                            {field.value}x de R${" "}
                            {form.watch("amount") / field.value}
                          </InputGroupAddon>
                        </InputGroup>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="periodicityParcelledPeriod"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field className="gap-2">
                        <FieldLabel htmlFor={field.name}>
                          Periodicidade
                        </FieldLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          defaultValue="monthly"
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o período" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Diário</SelectItem>
                            <SelectItem value="weekly">Semanal</SelectItem>
                            <SelectItem value="monthly">Mensal</SelectItem>
                            <SelectItem value="yearly">Anual</SelectItem>
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="periodicityParcelledSplit"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field orientation="horizontal">
                        <Checkbox
                          id={field.name}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          defaultChecked={false}
                        />
                        <FieldLabel htmlFor={field.name}>
                          Dividir entre as parcelas?
                        </FieldLabel>
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
      </form>
    </>
  );
}
