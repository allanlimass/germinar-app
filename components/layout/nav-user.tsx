"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChevronsUpDownIcon, LogOutIcon } from "lucide-react";
import { initials } from "@/lib/utils/services";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function NavUser({
  user,
  churches,
}: {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  churches: {
    id: string;
    name: string;
    logo?: string;
  }[];
}) {
  const router = useRouter();
  const { isMobile } = useSidebar();

  const handleLogout = () =>
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Sessão encerrada com sucesso");
          router.push("/login");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      },
    });

  const handleSetOrganization = (organizationId: string) =>
    authClient.organization.setActive(
      {
        organizationId,
      },
      {
        onSuccess: () => {
          toast.success("Igreja selecionada com sucesso");
          router.refresh();
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      },
    );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {initials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {initials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Igrejas</DropdownMenuLabel>
              {churches?.map((church) => (
                <DropdownMenuItem
                  key={church.id}
                  onClick={() => handleSetOrganization(church.id)}
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={church.logo} alt={church.name} />
                    <AvatarFallback className="rounded-lg">
                      {initials(church.name)}
                    </AvatarFallback>
                  </Avatar>
                  {church.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOutIcon />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
