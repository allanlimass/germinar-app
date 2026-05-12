"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  ChurchMember,
  CreateChurchMemberSchema,
  createChurchMemberSchema,
} from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, SaveIcon, Loader2Icon, User } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import React from "react";
import { createChurchMember, updateChurchMember } from "../actions";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { federativeUnits } from "@/data/federative-units";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "react-day-picker/locale";
import { parseISO, format, addMinutes } from "date-fns";
import { PatternFormat } from "react-number-format";

interface ChurchPosition {
  id: string;
  name: string;
}

interface ChurchFunction {
  id: string;
  name: string;
}

interface UpsertChurchMemberFormProps {
  initialData?: ChurchMember;
  churchPositions: ChurchPosition[];
  churchFunctions: ChurchFunction[];
  branchId: string;
}

export function UpsertChurchMemberForm({
  initialData,
  churchPositions,
  churchFunctions,
  branchId,
}: UpsertChurchMemberFormProps) {
  const router = useRouter();

  const [open, setOpen] = React.useState(false);

  const submitTypeRef = React.useRef<"default" | "continue">("default");
  const isEditing = !!initialData;

  const form = useForm<CreateChurchMemberSchema>({
    resolver: zodResolver(createChurchMemberSchema),
    defaultValues: {
      ...(isEditing && initialData ? { id: initialData.id } : {}),
      userId: initialData?.userId ?? null,
      churchPositionId: initialData?.churchPositionId ?? null,
      churchFunctionId: initialData?.churchFunctionId ?? null,
      type: initialData?.type ?? "member",
      photoUrl: initialData?.photoUrl ?? "",
      name: initialData?.name ?? "",
      birthDate: initialData?.birthDate ?? null,
      gender: initialData?.gender ?? "male",
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
      status: initialData?.status ?? "active",
    },
  });

  const createChurchMemberAction = useAction(createChurchMember, {
    onSuccess: () => {
      toast.success("Membro criado com sucesso!");
      if (submitTypeRef.current === "continue") {
        form.reset();
        return;
      }
      router.push(`/branch/${branchId}/people/members`);
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
      router.push(`/branch/${branchId}/people/members`);
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
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.error("Form validation errors:", errors);
          toast.error("Por favor, verifique os campos do formulário.");
        })}
      >
        <Tabs defaultValue="personal">
          <TabsList variant="line" className="mb-4">
            <TabsTrigger value="personal">Pessoal</TabsTrigger>
            <TabsTrigger value="contact">Contato</TabsTrigger>
            <TabsTrigger value="location">Localização</TabsTrigger>
            <TabsTrigger value="religious">Religioso</TabsTrigger>
          </TabsList>
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
                <CardDescription>
                  Informações básicas e identificação do membro.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Personal */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <Controller
                    name="photoUrl"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field className="col-span-1 sm:col-span-2">
                        <FieldLabel htmlFor={field.name}>
                          Foto de Perfil
                        </FieldLabel>
                        <div className="flex items-center gap-4">
                          <Avatar className="size-16">
                            <AvatarImage
                              src={field.value ?? undefined}
                              alt="Foto do membro"
                            />
                            <AvatarFallback>
                              <User className="size-8" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <Input
                              {...field}
                              type="url"
                              placeholder="https://exemplo.com/foto.jpg"
                              value={field.value ?? ""}
                              disabled={createChurchMemberAction.isPending}
                            />
                          </div>
                        </div>
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
                              <SelectItem value="member">Membro</SelectItem>
                              <SelectItem value="visitor">Visitante</SelectItem>
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
                              <SelectItem value="active">Ativo</SelectItem>
                              <SelectItem value="inactive">Inativo</SelectItem>
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
                    render={({ field, fieldState }) => {
                      const getSelectedDate = () => {
                        if (!field.value) return undefined;

                        const date =
                          typeof field.value === "string"
                            ? parseISO(field.value)
                            : field.value;

                        return addMinutes(date, date.getTimezoneOffset());
                      };

                      const selectedDate = getSelectedDate();

                      return (
                        <Field className="">
                          <FieldLabel htmlFor="date">
                            Data de nascimento
                          </FieldLabel>
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                id="date"
                                className="justify-start font-normal"
                              >
                                {selectedDate
                                  ? format(selectedDate, "dd/MM/yyyy", {
                                      locale: ptBR,
                                    })
                                  : "Selecione a data de nascimento"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto overflow-hidden p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => {
                                  field.onChange(date);
                                  setOpen(false);
                                }}
                                defaultMonth={selectedDate}
                                locale={ptBR}
                                captionLayout="dropdown"
                                disabled={(date) => date > new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      );
                    }}
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
                              <SelectItem value="male">Masculino</SelectItem>
                              <SelectItem value="female">Feminino</SelectItem>
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
                        <PatternFormat
                          {...field}
                          format="###.###.###-##"
                          mask="_"
                          customInput={Input}
                          value={field.value ?? ""}
                          onValueChange={(values) => {
                            field.onChange(values.value);
                          }}
                          placeholder="000.000.000-00"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contato</CardTitle>
                <CardDescription>
                  Informações de contato e comunicação.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Contact */}
                <div className="grid gap-6 sm:grid-cols-2">
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
                        <PatternFormat
                          {...field}
                          format="(##) #####-####"
                          mask="_"
                          customInput={Input}
                          value={field.value ?? ""}
                          onValueChange={(values) => {
                            field.onChange(values.value);
                          }}
                          placeholder="(00) 00000-0000"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="location">
            <Card>
              <CardHeader>
                <CardTitle>Localização</CardTitle>
                <CardDescription>Endereço de residência atual.</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Location */}
                <div className="grid gap-6 sm:grid-cols-2">
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
                        <FieldLabel htmlFor={field.name}>
                          Complemento
                        </FieldLabel>
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
                          onValueChange={field.onChange}
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="religious">
            <Card>
              <CardHeader>
                <CardTitle>Religioso</CardTitle>
                <CardDescription>
                  Informações eclesiásticas na igreja.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Religious */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <Controller
                    name="churchPositionId"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Cargo</FieldLabel>
                        <Select
                          {...field}
                          value={field.value ?? ""}
                          onValueChange={field.onChange}
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
                          onValueChange={field.onChange}
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between gap-4 border-t pt-6">
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              Cancelar
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="submit"
              variant="outline"
              disabled={form.formState.isSubmitting}
              onClick={() => (submitTypeRef.current = "continue")}
            >
              {form.formState.isSubmitting ? (
                <Loader2Icon className="size-4 animate-spin" />
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
                <Loader2Icon className="size-4 animate-spin" />
              ) : isEditing ? (
                "Salvar"
              ) : (
                "Adicionar"
              )}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
