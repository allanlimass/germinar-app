"use client";

import {
  createChurchAction,
  updateChurchAction,
} from "@/actions/church-actions";
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
  SelectLabel,
} from "@/components/ui/select";
import { federativeUnits } from "@/data/federative-units";
import {
  formatCnpj,
  formatPhoneNumber,
  formatZipCode,
} from "@/lib/utils/services";
import {
  CreateChurchInput,
  UpdateChurchInput,
  ChurchDbSchema,
  createChurchSchema,
  updateChurchSchema,
} from "@/lib/validations/church";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, SaveIcon, Loader2Icon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import React from "react";
import { DashboardHeader } from "@/components/layout/header";

interface ChurchOption {
  id: string;
  name: string;
  path: string | null;
}

interface UpsertChurchFormProps {
  initialData?: ChurchDbSchema;
  headquarters?: ChurchOption[];
  regionals?: ChurchOption[];
}

export function UpsertChurchForm({
  initialData,
  headquarters = [],
  regionals = [],
}: UpsertChurchFormProps) {
  const router = useRouter();

  const submitTypeRef = React.useRef<"default" | "continue">("default");
  const isEditing = !!initialData;

  const parentId = initialData?.path?.split(".").slice(0, -1).join(".");

  const form = useForm<CreateChurchInput | UpdateChurchInput>({
    resolver: zodResolver(isEditing ? updateChurchSchema : createChurchSchema),
    defaultValues: {
      id: initialData?.id || "",
      path: initialData?.path || "",
      name: initialData?.name || "",
      logo: initialData?.logo || "",
      type:
        (initialData?.type as "headquarters" | "regional" | "local") || "local",
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
      parentId: parentId || "",
    },
  });

  const createChurch = useAction(createChurchAction, {
    onSuccess: () => {
      toast.success("Igreja criada com sucesso!");
      if (submitTypeRef.current === "continue") {
        form.reset();
        router.refresh();
        return;
      }
      router.push("/organization/churches");
    },
    onError: (ctx) => {
      console.error(ctx);
      toast.error("Erro ao criar igreja: " + ctx.error.serverError);
    },
  });

  const updateChurch = useAction(updateChurchAction, {
    onSuccess: () => {
      toast.success("Filial atualizada com sucesso!");
      if (submitTypeRef.current === "continue") {
        router.refresh();
        return;
      }
      router.push("/organization/churches");
    },
    onError: ({ error }) => {
      toast.error("Erro ao atualizar filial: " + error.serverError);
    },
  });

  const isPending = createChurch.isPending || updateChurch.isPending;

  const onSubmit = (data: CreateChurchInput | UpdateChurchInput) => {
    if (isEditing && initialData) {
      updateChurch.execute({ ...data, id: initialData.id });
    } else {
      createChurch.execute({ ...data });
    }
  };
  return (
    <>
      <DashboardHeader
        heading={isEditing ? "Editar Igreja" : "Nova Igreja"}
        text={
          isEditing
            ? "Preencha os campos abaixo para editar a igreja"
            : "Preencha os campos abaixo para criar uma nova igreja"
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
                  name="type"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="col-span-1">
                      <FieldLabel htmlFor={field.name}>Tipo</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="headquarters">Matriz</SelectItem>
                            <SelectItem value="regional">Regional</SelectItem>
                            <SelectItem value="local">Local</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {form.watch("type") === "regional" && (
                  <Controller
                    name="parentId"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field className="col-span-1">
                        <FieldLabel htmlFor={field.name}>
                          Igreja Vinculada
                        </FieldLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            const selected = headquarters.find(
                              (h) => h.id === value,
                            );
                            if (selected) {
                              form.setValue("path", selected.path ?? "");
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a matriz..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {headquarters.map((church) => (
                                <SelectItem key={church.id} value={church.id}>
                                  {church.name}
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
                )}

                {form.watch("type") === "local" && (
                  <Controller
                    name="parentId"
                    control={form.control}
                    render={({ field, fieldState }) => {
                      const allParents = [...headquarters, ...regionals];
                      return (
                        <Field className="col-span-1">
                          <FieldLabel htmlFor={field.name}>
                            Igreja Vinculada
                          </FieldLabel>
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                              const selected = allParents.find(
                                (c) => c.id === value,
                              );
                              if (selected) {
                                form.setValue("path", selected.path ?? "");
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a igreja..." />
                            </SelectTrigger>
                            <SelectContent>
                              {headquarters.length > 0 && (
                                <SelectGroup>
                                  <SelectLabel>Matriz</SelectLabel>
                                  {headquarters.map((church) => (
                                    <SelectItem
                                      key={church.id}
                                      value={church.id}
                                    >
                                      {church.name}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              )}
                              {regionals.length > 0 && (
                                <SelectGroup>
                                  <SelectLabel>Regionais</SelectLabel>
                                  {regionals.map((church) => (
                                    <SelectItem
                                      key={church.id}
                                      value={church.id}
                                    >
                                      {church.name}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              )}
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      );
                    }}
                  />
                )}

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
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
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
                  disabled={isPending}
                  onClick={() => (submitTypeRef.current = "continue")}
                >
                  <SaveIcon className="h-4 w-4" />
                  {isPending ? (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  ) : isEditing ? (
                    "Salvar & Continuar"
                  ) : (
                    "Adicionar & Continuar"
                  )}
                </Button>

                <Button
                  type="submit"
                  disabled={isPending}
                  onClick={() => (submitTypeRef.current = "default")}
                >
                  <SaveIcon className="h-4 w-4" />
                  {isPending ? (
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
