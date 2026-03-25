"use client";

import { createBranch } from "@/app/actions/branch";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

type BranchFormValues = z.infer<typeof branchFormSchema>;

interface BranchFormProps {
  organizationId: string;
  onBack: () => void;
}

export default function BranchForm({
  organizationId,
  onBack,
}: BranchFormProps) {
  const router = useRouter();
  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: {
      name: "",
      organizationId,
    },
  });

  const onSubmit = useAction(createBranch, {
    onSuccess: () => {
      toast.success("Matriz criada com sucesso!");
      router.push("/dashboard");
    },
    onError: () => {
      toast.error("Erro ao criar matriz.");
    },
  });

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bem-vindo!</CardTitle>
          <CardDescription>Crie a matriz</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-4">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Nome da Matriz</FieldLabel>
                    <Input
                      id={field.name}
                      {...field}
                      placeholder="Digite o nome da matriz"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <div className="flex flex-row justify-between gap-4">
                <Field>
                  <Button type="button" variant="outline" onClick={onBack}>
                    Voltar
                  </Button>
                </Field>

                <Field>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                    ) : (
                      "Concluir"
                    )}
                  </Button>
                </Field>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
