import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  BranchMemberFormSchema,
  branchMemberFormSchema,
} from "@/lib/validations/branch-member";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { toast } from "sonner";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface UpsertBranchMemberFormProps {
  initialData?: BranchMemberFormSchema;
}

export function UpsertBranchMemberForm({
  initialData,
}: UpsertBranchMemberFormProps) {
  const form = useForm<BranchMemberFormSchema>({
    resolver: zodResolver(branchMemberFormSchema),
    defaultValues: {
      email: initialData?.email || "",
      role: initialData?.role || "member",
    },
  });

  const createBranchMemberAction = "";
  const updateBranchMemberAction = "";
  const onSubmit = () => {};

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
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.email}>E-mail</FieldLabel>
                <Input
                  id={field.email}
                  placeholder="exemplo@email.com"
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>
    </>
  );
}
