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
import {
  InboxIcon,
  TerminalIcon,
  UsersIcon,
  Group,
  ChevronRight,
  SunIcon,
  MoonIcon,
  Church,
  DollarSign,
  Megaphone,
  ArrowDown,
  ArrowUp,
  Landmark,
  Gauge,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://github.com/shadcn.png",
  },
  navMain: [
    {
      title: "Igreja",
      url: "#",
      icon: <Church />,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "#",
          icon: <Gauge />,
          isActive: false,
        },
        {
          title: "Igrejas",
          url: "/organization/churches",
          icon: <Church />,
          isActive: false,
        },
        {
          title: "Usuários",
          url: "/administrative/users",
          icon: <Users />,
          isActive: false,
        },
        {
          title: "Relatórios",
          url: "/churches/reports",
          icon: <InboxIcon />,
          isActive: false,
        },
      ],
    },
    {
      title: "Pessoas",
      url: "#",
      icon: <UsersIcon />,
      isActive: false,
      items: [
        {
          title: "Dashboard",
          url: "#",
          icon: <InboxIcon />,
          isActive: false,
        },
        {
          title: "Membros",
          url: "#",
          icon: <InboxIcon />,
          isActive: false,
        },
        {
          title: "Relatórios",
          url: "#",
          icon: <InboxIcon />,
          isActive: false,
        },
      ],
    },
    {
      title: "Finanças",
      url: "#",
      icon: <DollarSign />,
      isActive: false,
      items: [
        {
          title: "Dashboard",
          url: "#",
          icon: <InboxIcon />,
          isActive: false,
        },
        {
          title: "Receitas",
          url: "#",
          icon: <ArrowDown />,
          isActive: false,
        },
        {
          title: "Despesas",
          url: "#",
          icon: <ArrowUp />,
          isActive: false,
        },
        {
          title: "Fornecedores",
          url: "#",
          icon: <InboxIcon />,
          isActive: false,
        },
        {
          title: "Plano de Contas",
          url: "#",
          icon: <InboxIcon />,
          isActive: false,
        },
        {
          title: "Contas",
          url: "#",
          icon: <Landmark />,
          isActive: false,
        },
        {
          title: "Relatórios",
          url: "#",
          icon: <InboxIcon />,
          isActive: false,
        },
      ],
    },
    {
      title: "Comunicação",
      url: "#",
      icon: <Megaphone />,
      isActive: false,
    },
    {
      title: "Células",
      url: "#",
      icon: <Group />,
      isActive: false,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeItem, setActiveItem] = React.useState(data.navMain[0]);
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
                <a href="#">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <TerminalIcon className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Acme Inc</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
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
                      {item.icon}
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
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>

      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-foreground text-base font-medium">
              {activeItem?.title}
            </div>
            <SidebarTrigger className="-ml-1" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {activeItem?.items?.map((subItem) => (
                  <SidebarMenuItem
                    key={subItem.title}
                    className="py-2.5 md:py-1"
                  >
                    <SidebarMenuButton
                      asChild
                      className="gap-3"
                      isActive={subItem.isActive}
                    >
                      <Link href={subItem.url}>
                        {subItem.icon}
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
