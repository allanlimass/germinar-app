"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  TerminalSquareIcon,
  BotIcon,
  BookOpenIcon,
  Settings2Icon,
  LifeBuoyIcon,
  SendIcon,
  FrameIcon,
  PieChartIcon,
  MapIcon,
  TerminalIcon,
  HandCoinsIcon,
  LayoutDashboardIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ListIcon,
  LandmarkIcon,
  StoreIcon,
  FileSpreadsheetIcon,
  InboxIcon,
} from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const data = {
  navMain: [
    {
      title: "Diretoria",
      url: "#",
      icon: TerminalSquareIcon,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Secretaria",
      url: "#",
      icon: BotIcon,
      items: [
        {
          title: "Dashboard",
          url: "#",
        },
        {
          title: "Membros",
          url: "#",
        },
        {
          title: "Relatórios",
          url: "#",
        },
      ],
    },
    {
      title: "Tesouraria",
      url: "#",
      icon: HandCoinsIcon,
      items: [
        {
          title: "Dashboard",
          url: "#",
          icon: LayoutDashboardIcon,
        },
        {
          title: "Recebimentos",
          url: "#",
          icon: ArrowUpIcon,
        },
        {
          title: "Pagamentos",
          url: "#",
          icon: ArrowDownIcon,
        },
        {
          title: "Planos de Contas",
          url: "#",
          icon: ListIcon,
        },
        {
          title: "Centros de Custos",
          url: "#",
          icon: InboxIcon,
        },
        {
          title: "Contas Bancárias",
          url: "#",
          icon: LandmarkIcon,
        },
        {
          title: "Fornecedores",
          url: "#",
          icon: StoreIcon,
        },
        {
          title: "Relatórios",
          url: "#",
          icon: FileSpreadsheetIcon,
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpenIcon,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2Icon,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: FrameIcon,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChartIcon,
    },
    {
      name: "Travel",
      url: "#",
      icon: MapIcon,
    },
  ],
  navSecondary: [
    {
      title: "Suporte",
      url: "#",
      icon: LifeBuoyIcon,
    },
    {
      title: "Feedback",
      url: "#",
      icon: SendIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, isPending } = authClient.useSession();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
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
