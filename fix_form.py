import re

with open("app/(dashboard)/people/members/_components/upsert-church-member-form.tsx", "r") as f:
    text = f.read()

# Add Card import
if "import { Card" not in text:
    text = text.replace(
        "import { Separator } from \"@/components/ui/separator\";",
        """import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";"""
    )


# The original structure:
#       <Tabs defaultValue="personal">
#           ...
#       </Tabs>
#       <form
#         className="flex h-full flex-col"
#         ...
#       </form>

# We want to change the Avatar photoUrl to be an input and avatar next to it
photoUrl_input = """<Field className="col-span-1 sm:col-span-2">
                  <FieldLabel htmlFor={field.name}>Foto de Perfil</FieldLabel>
                  <div className="flex items-center gap-4">
                    <Avatar className="size-16">
                      <AvatarImage src={field.value ?? undefined} alt="Foto do membro" />
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
                </Field>"""

text = re.sub(r'<Field className="col-span-2">.*?<Avatar className="size-24">.*?</Field>', photoUrl_input, text, flags=re.DOTALL)


# Now let's wrap contents inside cards
def convert_tab_content(match):
    value = match.group(1)
    content = match.group(2)
    
    titles = {
        "personal": ("Dados Pessoais", "Informações básicas e identificação do membro."),
        "contact": ("Contato", "Informações de contato e comunicação."),
        "location": ("Localização", "Endereço de residência atual."),
        "religious": ("Religioso", "Informações eclesiásticas na igreja.")
    }
    
    title, desc = titles.get(value, ("", ""))
    
    # We replace the `<div className="grid gap-4 sm:grid-cols-2">` with card content
    # For religious tab, it was `<div className="flex flex-col gap-4">`
    content = re.sub(
        r'<div className="(?:grid gap-4 sm:grid-cols-2|flex flex-col gap-4)">',
        r'<div className="grid gap-6 sm:grid-cols-2">',
        content
    )
    
    return f"""<TabsContent value="{value}">
          <Card>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{desc}</CardDescription>
            </CardHeader>
            <CardContent>
              {content}
            </CardContent>
          </Card>
        </TabsContent>"""

text = re.sub(r'<TabsContent value="(.*?)">(.*?)</TabsContent>', convert_tab_content, text, flags=re.DOTALL)


# Now wrap Tabs inside form
# Replace `<Tabs defaultValue="personal">` with form opening
tabs_start_idx = text.find('<Tabs defaultValue="personal">')
form_start_idx = text.find('<form', tabs_start_idx)
form_end_idx = text.find('</form>', form_start_idx) + 7

tabs_str = text[tabs_start_idx:form_start_idx]
form_open_match = re.search(r'(<form[^>]+>)', text[form_start_idx:form_end_idx])
form_open_str = form_open_match.group(1)

# fix form flex gap
form_open_str = form_open_str.replace('className="flex h-full flex-col"', 'className="flex flex-col gap-6"')

buttons_html = """
        <div className="flex items-center justify-end gap-4 border-t pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
          >
            <ArrowLeftIcon className="mr-2 size-4" />
            Voltar
          </Button>

          <Button
            type="submit"
            variant="outline"
            disabled={form.formState.isSubmitting}
            onClick={() => (submitTypeRef.current = "continue")}
          >
            <SaveIcon className="mr-2 size-4" />
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
            <SaveIcon className="mr-2 size-4" />
            {form.formState.isSubmitting ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : isEditing ? (
              "Salvar"
            ) : (
              "Adicionar"
            )}
          </Button>
        </div>
"""

new_structure = f"""{form_open_str}
      {tabs_str}
      {buttons_html}
      </form>"""

text = text[:tabs_start_idx] + new_structure + text[form_end_idx:]


with open("app/(dashboard)/people/members/_components/upsert-church-member-form.tsx", "w") as f:
    f.write(text)

print("done")
