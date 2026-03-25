"use client";

import { createBranch } from "@/app/actions/branch";
import { Button } from "@/components/ui/button";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import z from "zod";

import { branchFormSchema } from "@/validators/branch";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { federativeUnits } from "@/data/federative-units";

export default function NewBranchPage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof branchFormSchema>>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: {
      isHeadquarter: false,
      name: "",
      cnpj: "",
      phone: "",
      email: "",
      zipCode: "",
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });

  const createBranchAction = useAction(createBranch, {
    onSuccess: () => {
      toast.success("Matriz criada com sucesso!");
      router.push("/branches");
    },
    onError: () => {
      toast.error("Erro ao criar matriz.");
    },
  });

  const onSubmit = (values: z.infer<typeof branchFormSchema>) => {
    createBranchAction.execute(values);
  };

  return (
    <main>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Controller
              name="isHeadquarter"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="col-span-1">
                  <FieldLabel htmlFor={field.name}>Tipo</FieldLabel>
                  <Select
                    value={field.value.toString()}
                    onValueChange={(value) => field.onChange(value === "true")}
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                <Field>
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
                  <FieldLabel htmlFor={field.name}>Estado</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o estado" />
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

          <div className="flex w-full items-center justify-between pt-4">
            <Field className="flex flex-1">
              <div className="flex items-center justify-start">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.back()}
                >
                  Voltar
                </Button>
              </div>
            </Field>

            <Field
              orientation="horizontal"
              className="flex flex-1 items-center justify-end gap-4"
            >
              <Button
                type="button"
                variant="outline"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                ) : (
                  "Salvar & Continuar"
                )}
              </Button>

              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                ) : (
                  "Salvar"
                )}
              </Button>
            </Field>
          </div>
        </FieldGroup>
      </form>
    </main>
  );
}
