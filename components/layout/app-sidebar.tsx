"use client";

import * as React from "react";

import { NavUser } from "@/components/layout/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { TerminalIcon, ChevronRight, SunIcon, MoonIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Inbox,
  User,
  Church,
  DollarSign,
  Megaphone,
  ArrowUp,
  ArrowDown,
  Landmark,
  Gauge,
  Group,
  Users,
  FileText,
  Award,
  HandHeart,
  Briefcase,
} from "lucide-react";

export function AppSidebar({
  user,
  role,
  activeBranchId,
  branches,
  ...props
}: {
  user: { name: string; email: string; image?: string | null };
  role: { role: "owner" | "admin" | "member" };
  activeBranchId?: string | null;
  branches: { id: string; name: string; logo?: string }[];
  props?: React.ComponentProps<typeof Sidebar>;
}) {
  const pathname = usePathname();

  const currentBranchId = React.useMemo(() => {
    if (pathname.startsWith("/branch/")) {
      const segments = pathname.split("/");
      return segments[2] || activeBranchId;
    }
    return activeBranchId;
  }, [pathname, activeBranchId]);

  const data = {
    navOrganization: [
      {
        title: "Organização",
        url: "#",
        icon: Briefcase,
        isActive: false,
        items: [
          {
            title: "Dashboard",
            url: "/organization",
            icon: Gauge,
            isActive: false,
          },
          {
            title: "Filiais",
            url: "/organization/branches",
            icon: Church,
            isActive: false,
          },
          {
            title: "Usuários",
            url: "/organization/users",
            icon: Users,
            isActive: false,
          },
          {
            title: "Relatórios",
            url: "/organization/reports",
            icon: FileText,
            isActive: false,
          },
        ],
      },
    ],
    navBranch: [
      {
        title: "Administração",
        url: "#",
        icon: Church,
        isActive: false,
        items: [
          {
            title: "Dashboard",
            url: `/branch/${currentBranchId}/administration`,
            icon: Gauge,
            isActive: false,
          },
          {
            title: "Cargos",
            url: `/branch/${currentBranchId}/administration/positions`,
            icon: Award,
            isActive: false,
          },
          {
            title: "Funções",
            url: `/branch/${currentBranchId}/administration/functions`,
            icon: HandHeart,
            isActive: false,
          },
          {
            title: "Usuários",
            url: `/branch/${currentBranchId}/administration/branch-members`,
            icon: Users,
            isActive: false,
          },
          {
            title: "Relatórios",
            url: `/branch/${currentBranchId}/administration/reports`,
            icon: FileText,
            isActive: false,
          },
        ],
      },
      {
        title: "Pessoas",
        url: "#",
        icon: User,
        isActive: false,
        items: [
          {
            title: "Dashboard",
            url: `/branch/${currentBranchId}/people`,
            icon: Gauge,
            isActive: false,
          },
          {
            title: "Membros",
            url: `/branch/${currentBranchId}/people/members`,
            icon: Users,
            isActive: false,
          },
          {
            title: "Relatórios",
            url: `/branch/${currentBranchId}/people/reports`,
            icon: FileText,
            isActive: false,
          },
        ],
      },
      {
        title: "Finanças",
        url: "#",
        icon: DollarSign,
        isActive: false,
        items: [
          {
            title: "Dashboard",
            url: `/branch/${currentBranchId}/finance`,
            icon: Gauge,
            isActive: false,
          },
          {
            title: "Recebimentos",
            url: `/branch/${currentBranchId}/finance/incomes`,
            icon: ArrowDown,
            isActive: false,
          },
          {
            title: "Pagamentos",
            url: `/branch/${currentBranchId}/finance/expenses`,
            icon: ArrowUp,
            isActive: false,
          },
          {
            title: "Fornecedores",
            url: `/branch/${currentBranchId}/finance/suppliers`,
            icon: Inbox,
            isActive: false,
          },
          {
            title: "Plano de Contas",
            url: `/branch/${currentBranchId}/finance/chart-of-accounts`,
            icon: Inbox,
            isActive: false,
          },
          {
            title: "Centros de Custo",
            url: `/branch/${currentBranchId}/finance/cost-centers`,
            icon: Inbox,
            isActive: false,
          },
          {
            title: "Contas",
            url: `/branch/${currentBranchId}/finance/accounts`,
            icon: Landmark,
            isActive: false,
          },
          {
            title: "Relatórios",
            url: `/branch/${currentBranchId}/finance/reports`,
            icon: Inbox,
            isActive: false,
          },
        ],
      },
      {
        title: "Comunicação",
        url: "#",
        icon: Megaphone,
        isActive: false,
      },
      {
        title: "Células",
        url: "#",
        icon: Group,
        isActive: false,
      },
    ],
  };

  const [activeItem, setActiveItem] = React.useState(
    role.role === "member" ? data.navBranch[0] : data.navOrganization[0],
  );
  const { theme, setTheme } = useTheme();

  const { setOpen } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <Link href="#">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <TerminalIcon className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Acme Inc</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {role.role !== "member" &&
                  data.navOrganization.map((item) => (
                    <SidebarMenuItem className="py-1" key={item.title}>
                      <SidebarMenuButton
                        tooltip={{
                          children: item.title,
                          hidden: false,
                        }}
                        onClick={() => {
                          setActiveItem(item);
                          setOpen(true);
                        }}
                        isActive={activeItem?.title === item.title}
                        className="px-2.5 md:px-2"
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
              <SidebarMenu>
                {currentBranchId &&
                  data.navBranch.map((item) => (
                    <SidebarMenuItem className="py-1" key={item.title}>
                      <SidebarMenuButton
                        tooltip={{
                          children: item.title,
                          hidden: false,
                        }}
                        onClick={() => {
                          setActiveItem(item);
                          setOpen(true);
                        }}
                        isActive={activeItem?.title === item.title}
                        className="px-2.5 md:px-2"
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={{
                children: theme === "dark" ? "Modo claro" : "Modo escuro",
                hidden: false,
              }}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="px-2.5 md:px-2"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              <span>Tema</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <NavUser user={user} branches={branches} />
        </SidebarFooter>
      </Sidebar>

      <Sidebar
        collapsible="none"
        className="bg-background hidden flex-1 md:flex"
      >
        <SidebarHeader className="gap-3.5 p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-foreground text-base font-medium">
              {activeItem?.title}
            </div>
            <SidebarTrigger className="-ml-1" />
          </div>
        </SidebarHeader>
        <SidebarContent className="px-2">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {activeItem?.items?.map((subItem) => (
                  <SidebarMenuItem
                    key={subItem.title}
                    className="py-2.5 md:py-0.5"
                  >
                    <SidebarMenuButton
                      asChild
                      className="gap-3"
                      isActive={subItem.isActive}
                    >
                      <Link href={subItem.url}>
                        <subItem.icon />
                        <span>{subItem.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
}
