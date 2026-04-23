import re

with open("app/(dashboard)/people/members/_components/upsert-church-member-form.tsx", "r") as f:
    content = f.read()

# adding imports
import_card = """import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
"""

if "from \"@/components/ui/card\"" not in content:
    content = content.replace('import { Separator }', import_card + 'import { Separator }')


# replacing tabs and form
tabs_match = re.search(r'(<Tabs defaultValue="personal">.*)      <form', content, re.DOTALL)
if tabs_match:
    tabs_content = tabs_match.group(1)
    # The existing code has Tabs outside form. We want to extract the TabsContent sections
    
    # Let's replace the whole structure manually
    
