"use client";

import { Button } from "@/components/ui/button";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  ChurchMemberFormSchema,
  CreateChurchMemberSchema,
  createChurchMemberSchema,
} from "@/lib/validations/church-member";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, SaveIcon, Loader2Icon, User } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import React from "react";
import {
  createChurchMember,
  updateChurchMember,
} from "@/actions/church-member-actions";
import { DashboardHeader } from "@/components/layout/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { federativeUnits } from "@/data/federative-units";

interface ChurchPosition {
  id: string;
  name: string;
}

interface ChurchFunction {
  id: string;
  name: string;
}

interface UpsertChurchMemberFormProps {
  initialData?: ChurchMemberFormSchema;
  churchPositions: ChurchPosition[];
  churchFunctions: ChurchFunction[];
}

export function UpsertChurchMemberForm({
  initialData,
  churchPositions,
  churchFunctions,
}: UpsertChurchMemberFormProps) {
  const router = useRouter();

  const submitTypeRef = React.useRef<"default" | "continue">("default");
  const isEditing = !!initialData;

  const form = useForm<CreateChurchMemberSchema>({
    resolver: zodResolver(createChurchMemberSchema),
    defaultValues: {
      userId: initialData?.userId ?? "",
      churchPositionId: initialData?.churchPositionId ?? "",
      churchFunctionId: initialData?.churchFunctionId ?? "",
      type: initialData?.type ?? "MEMBER",
      photoUrl: initialData?.photoUrl ?? "",
      name: initialData?.name ?? "",
      birthDate: initialData?.birthDate ?? undefined,
      gender: initialData?.gender ?? "MALE",
      cpf: initialData?.cpf ?? "",
      email: initialData?.email ?? "",
      phone: initialData?.phone ?? "",
      zipCode: initialData?.zipCode ?? "",
      street: initialData?.street ?? "",
      number: initialData?.number ?? "",
      neighborhood: initialData?.neighborhood ?? "",
      complement: initialData?.complement ?? "",
      city: initialData?.city ?? "",
      state: initialData?.state ?? "",
      status: initialData?.status ?? "ACTIVE",
    },
  });

  const createChurchMemberAction = useAction(createChurchMember, {
    onSuccess: () => {
      toast.success("Membro criado com sucesso!");
      if (submitTypeRef.current === "continue") {
        form.reset();
        return;
      }
      router.push("/organization/church-members");
    },
    onError: ({ error }) => {
      toast.error("Erro ao criar membro: " + error.serverError);
    },
  });

  const updateChurchMemberAction = useAction(updateChurchMember, {
    onSuccess: () => {
      toast.success("Membro atualizado com sucesso!");
      if (submitTypeRef.current === "continue") {
        return;
      }
      router.push("/organization/church-members");
    },
    onError: ({ error }) => {
      toast.error("Erro ao atualizar membro: " + error.serverError);
    },
  });

  const onSubmit = (data: CreateChurchMemberSchema) => {
    if (isEditing && initialData) {
      updateChurchMemberAction.execute({ ...data, id: initialData.id });
    } else {
      createChurchMemberAction.execute(data);
    }
  };
  return (
    <>
      <DashboardHeader
        heading={isEditing ? "Editar Membro" : "Novo Membro"}
        text={
          isEditing
            ? "Edite as informações do membro"
            : "Preencha os dados para criar um novo membro"
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
            <div className="space-y-8 overflow-y-auto">
              {/* Personal Information */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field className="col-span-3 mb-4">
                  <FieldLabel htmlFor="name">Informações pessoais</FieldLabel>
                  <FieldDescription htmlFor="name">
                    Preencha os dados pessoais do membro
                  </FieldDescription>
                </Field>
                <Controller
                  name="photoUrl"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Foto</FieldLabel>
                      <Avatar className="size-24">
                        <AvatarImage src={field.value} alt="Foto do membro" />
                        <AvatarFallback>
                          <User className="size-12" />
                        </AvatarFallback>
                      </Avatar>
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
                    <Field>
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
                            <SelectItem value="MEMBER">Membro</SelectItem>
                            <SelectItem value="VISITOR">Visitante</SelectItem>
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
                  name="status"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="ACTIVE">Ativo</SelectItem>
                            <SelectItem value="INACTIVE">Inativo</SelectItem>
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
                    <Field>
                      <FieldLabel htmlFor={field.name}>Nome</FieldLabel>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Digite o nome completo"
                        disabled={createChurchMemberAction.isPending}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="birthDate"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Data de nascimento
                      </FieldLabel>
                      <Input
                        {...field}
                        type="date"
                        placeholder="Digite a data de nascimento"
                        disabled={createChurchMemberAction.isPending}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="gender"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Gênero</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o gênero" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="MALE">Masculino</SelectItem>
                            <SelectItem value="FEMALE">Feminino</SelectItem>
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
                  name="cpf"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>CPF</FieldLabel>
                      <Input
                        {...field}
                        type="text"
                        placeholder="000.000.000-00"
                        value={field.value ?? ""}
                        disabled={createChurchMemberAction.isPending}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <Separator />

              {/* Contact Information */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field className="col-span-3 mb-4">
                  <FieldLabel htmlFor="name">Informações de contato</FieldLabel>
                  <FieldDescription htmlFor="name">
                    Preencha as informações de contato do membro
                  </FieldDescription>
                </Field>

                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        {...field}
                        type="email"
                        placeholder="email@exemplo.com"
                        value={field.value ?? ""}
                        disabled={createChurchMemberAction.isPending}
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
                        {...field}
                        type="tel"
                        placeholder="(11) 99999-9999"
                        value={field.value ?? ""}
                        disabled={createChurchMemberAction.isPending}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <Separator />

              {/* Address Information */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field className="col-span-3 mb-4">
                  <FieldLabel htmlFor="name">
                    Informações de endereço
                  </FieldLabel>
                  <FieldDescription htmlFor="name">
                    Preencha as informações de endereço do membro
                  </FieldDescription>
                </Field>

                <Controller
                  name="zipCode"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>CEP</FieldLabel>
                      <Input
                        {...field}
                        type="text"
                        placeholder="12345-678"
                        value={field.value ?? ""}
                        disabled={createChurchMemberAction.isPending}
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
                    <Field>
                      <FieldLabel htmlFor={field.name}>Rua</FieldLabel>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Nome da rua"
                        value={field.value ?? ""}
                        disabled={createChurchMemberAction.isPending}
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
                        {...field}
                        type="text"
                        placeholder="123"
                        value={field.value ?? ""}
                        disabled={createChurchMemberAction.isPending}
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
                        {...field}
                        type="text"
                        placeholder="Nome do bairro"
                        value={field.value ?? ""}
                        disabled={createChurchMemberAction.isPending}
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
                        {...field}
                        type="text"
                        placeholder="Apto, Bloco, etc."
                        value={field.value ?? ""}
                        disabled={createChurchMemberAction.isPending}
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
                    <Field>
                      <FieldLabel htmlFor={field.name}>Cidade</FieldLabel>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Nome da cidade"
                        value={field.value ?? ""}
                        disabled={createChurchMemberAction.isPending}
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
                        {...field}
                        value={field.value ?? ""}
                        disabled={createChurchMemberAction.isPending}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a UF" />
                        </SelectTrigger>
                        <SelectContent>
                          {federativeUnits.map((federativeUnit) => (
                            <SelectItem
                              key={federativeUnit.value}
                              value={federativeUnit.value}
                            >
                              {federativeUnit.value}
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

              {/* Church Information */}
              <div className="flex flex-col gap-4">
                <Field className="col-span-3 mb-4">
                  <FieldLabel htmlFor="churchPositionId">Cargo</FieldLabel>
                  <FieldDescription htmlFor="churchPositionId">
                    Selecione o cargo do membro
                  </FieldDescription>
                </Field>
                <Controller
                  name="churchPositionId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Cargo</FieldLabel>
                      <Select
                        {...field}
                        value={field.value ?? ""}
                        disabled={createChurchMemberAction.isPending}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o cargo" />
                        </SelectTrigger>
                        <SelectContent>
                          {churchPositions.map((churchPosition) => (
                            <SelectItem
                              key={churchPosition.id}
                              value={churchPosition.id}
                            >
                              {churchPosition.name}
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
                  name="churchFunctionId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Função</FieldLabel>
                      <Select
                        {...field}
                        value={field.value ?? ""}
                        disabled={createChurchMemberAction.isPending}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a função" />
                        </SelectTrigger>
                        <SelectContent>
                          {churchFunctions.map((churchFunction) => (
                            <SelectItem
                              key={churchFunction.id}
                              value={churchFunction.id}
                            >
                              {churchFunction.name}
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
