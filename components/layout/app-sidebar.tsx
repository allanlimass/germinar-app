"use client";

import * as React from "react";

import { NavMain } from "@/components/layout/nav-main";
import { NavSecondary } from "@/components/layout/nav-secondary";
import { NavUser } from "@/components/layout/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { authClient } from "@/lib/auth-client";
import { data } from "@/data/sidebar-data";
import { ChevronsUpDownIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { initials } from "@/lib/utils/services";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  churches: {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    type: string;
  }[];
}

export function AppSidebar({ churches, ...props }: AppSidebarProps) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { isMobile } = useSidebar();

  const currentChurch = session?.session.activeOrganizationId;
  const { name: currentChurchName, type: currentChurchType } = churches.find(
    (church) => church.id === currentChurch,
  ) || { name: "", type: "" };

  const handleSetActiveChurch = async (organizationId: string) => {
    try {
      await authClient.organization.setActive({ organizationId });
      toast.success("Igreja acessada com sucesso!");
      router.refresh();
    } catch {
      toast.error("Erro ao acessar igreja.");
    }
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="#" alt="" />
                    <AvatarFallback className="rounded-lg">
                      {initials(currentChurchName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {currentChurchName}
                    </span>
                    <span className="truncate text-xs">
                      {currentChurchType === "headquarters"
                        ? "Matriz"
                        : currentChurchType === "regional"
                          ? "Regional"
                          : "Local"}
                    </span>
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
                <DropdownMenuLabel>Igrejas</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {churches.map((church) => (
                  <DropdownMenuItem
                    key={church.id}
                    onClick={() => handleSetActiveChurch(church.id)}
                  >
                    <div className="flex items-center gap-2 px-1 py-1 text-left text-sm">
                      <Avatar className="h-6 w-6 rounded-md">
                        <AvatarImage src="#" alt="" />
                        <AvatarFallback className="rounded-lg">
                          {initials(church.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-xs leading-tight">
                        <span className="truncate font-medium">
                          {church.name}
                        </span>
                        <span className="truncate text-xs">
                          {church.type === "headquarters"
                            ? "Matriz"
                            : church.type === "regional"
                              ? "Regional"
                              : "Local"}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {isPending ? null : (
          <NavUser
            user={{
              name: session?.user?.name || "",
              email: session?.user?.email || "",
              image: session?.user?.image || "",
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
